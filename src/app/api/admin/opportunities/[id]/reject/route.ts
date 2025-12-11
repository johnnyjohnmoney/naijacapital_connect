import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  logAdminAction,
  AdminActions,
  getIpAddress,
  getUserAgent,
} from "@/lib/admin-audit";
import { z } from "zod";

const rejectSchema = z.object({
  rejectionReason: z
    .string()
    .min(10, "Rejection reason must be at least 10 characters"),
  adminNotes: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Only administrators can reject opportunities
    if (session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json(
        { error: "Only administrators can reject opportunities" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = rejectSchema.parse(body);

    // Get the opportunity
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
      },
    });

    if (!opportunity) {
      return NextResponse.json(
        { error: "Opportunity not found" },
        { status: 404 }
      );
    }

    // Check if opportunity is in a valid state for rejection
    if (
      opportunity.status !== "PENDING_REVIEW" &&
      opportunity.status !== "NEEDS_REVISION"
    ) {
      return NextResponse.json(
        {
          error: `Cannot reject opportunity with status: ${opportunity.status}`,
        },
        { status: 400 }
      );
    }

    // Update opportunity to REJECTED status
    const updatedOpportunity = await prisma.business.update({
      where: { id },
      data: {
        status: "REJECTED",
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
        rejectionReason: validatedData.rejectionReason,
        adminNotes: validatedData.adminNotes || null,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create notification for business owner
    await prisma.notification.create({
      data: {
        title: "Opportunity Not Approved",
        content: `Your investment opportunity "${opportunity.title}" was not approved. Reason: ${validatedData.rejectionReason}. You can review our guidelines and submit a new opportunity that meets our requirements.`,
        userId: opportunity.ownerId,
      },
    });

    // Log admin action
    await logAdminAction({
      adminId: session.user.id,
      action: AdminActions.REJECT_OPPORTUNITY,
      targetType: "BUSINESS",
      targetId: id,
      details: {
        opportunityTitle: opportunity.title,
        previousStatus: opportunity.status,
        newStatus: "REJECTED",
        rejectionReason: validatedData.rejectionReason,
        adminNotes: validatedData.adminNotes,
      },
      ipAddress: getIpAddress(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json({
      success: true,
      message: "Opportunity rejected",
      opportunity: {
        id: updatedOpportunity.id,
        title: updatedOpportunity.title,
        status: updatedOpportunity.status,
        reviewedBy: updatedOpportunity.reviewedBy,
        reviewedAt: updatedOpportunity.reviewedAt,
        rejectionReason: updatedOpportunity.rejectionReason,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Opportunity rejection error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
