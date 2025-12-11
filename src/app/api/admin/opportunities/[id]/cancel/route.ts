import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAction } from "@/lib/admin-audit";
import { z } from "zod";

const approveCancellationSchema = z.object({
  refundInvestments: z.boolean().default(true),
  adminNotes: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json(
        { error: "Only administrators can approve cancellations" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = approveCancellationSchema.parse(body);

    // Get the opportunity with investments
    const opportunity = await prisma.business.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        investments: {
          where: {
            status: "ACTIVE",
          },
          include: {
            investor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!opportunity) {
      return NextResponse.json(
        { error: "Opportunity not found" },
        { status: 404 }
      );
    }

    if (opportunity.status !== "SUSPENDED") {
      return NextResponse.json(
        {
          error:
            "This opportunity does not have a pending cancellation request",
        },
        { status: 400 }
      );
    }

    // Mark opportunity as cancelled
    const updatedOpportunity = await prisma.business.update({
      where: { id },
      data: {
        status: "CANCELLED",
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
        adminNotes: validatedData.adminNotes
          ? `${opportunity.adminNotes || ""}\n\nAdmin Cancellation Notes: ${
              validatedData.adminNotes
            }`
          : opportunity.adminNotes,
      },
    });

    // Handle investment refunds if requested
    if (validatedData.refundInvestments && opportunity.investments.length > 0) {
      // Mark all active investments as cancelled
      await prisma.investment.updateMany({
        where: {
          businessId: id,
          status: "ACTIVE",
        },
        data: {
          status: "CANCELLED",
        },
      });

      // Create notifications for all affected investors
      for (const investment of opportunity.investments) {
        await prisma.notification.create({
          data: {
            title: "Investment Cancelled - Refund Initiated",
            content: `The opportunity "${
              opportunity.title
            }" has been cancelled. Your investment of ₦${investment.amount.toLocaleString()} will be refunded. Please allow 3-5 business days for processing.`,
            userId: investment.investor.id,
          },
        });
      }

      // TODO: Trigger actual refund processing
      // This would integrate with payment processor to refund investors
    }

    // Notify business owner
    await prisma.notification.create({
      data: {
        title: "Cancellation Request Approved",
        content: `Your cancellation request for "${
          opportunity.title
        }" has been approved. ${
          opportunity.investments.length > 0
            ? "All active investments will be refunded."
            : ""
        }`,
        userId: opportunity.ownerId,
      },
    });

    // Log admin action
    await logAdminAction({
      adminId: session.user.id!,
      action: "APPROVE_CANCELLATION",
      targetType: "BUSINESS",
      targetId: id,
      details: {
        opportunityTitle: opportunity.title,
        ownerId: opportunity.ownerId,
        ownerName: opportunity.owner.name,
        investmentCount: opportunity.investments.length,
        refundInvestments: validatedData.refundInvestments,
        adminNotes: validatedData.adminNotes,
      },
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message: "Cancellation approved successfully",
      opportunity: {
        id: updatedOpportunity.id,
        status: updatedOpportunity.status,
      },
      refundedInvestments: validatedData.refundInvestments
        ? opportunity.investments.length
        : 0,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error approving cancellation:", error);
    return NextResponse.json(
      { error: "Failed to approve cancellation" },
      { status: 500 }
    );
  }
}
