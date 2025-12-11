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

const approveSchema = z.object({
  adminNotes: z.string().optional(),
  isFeatured: z.boolean().optional().default(false),
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

    // Only administrators can approve opportunities
    if (session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json(
        { error: "Only administrators can approve opportunities" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = approveSchema.parse(body);

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

    // Check if opportunity is in a valid state for approval
    if (
      opportunity.status !== "PENDING_REVIEW" &&
      opportunity.status !== "NEEDS_REVISION"
    ) {
      return NextResponse.json(
        {
          error: `Cannot approve opportunity with status: ${opportunity.status}`,
        },
        { status: 400 }
      );
    }

    // Update opportunity to OPEN status
    const updatedOpportunity = await prisma.business.update({
      where: { id },
      data: {
        status: "OPEN",
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
        adminNotes: validatedData.adminNotes || null,
        isFeatured: validatedData.isFeatured,
        revisionRequests: null, // Clear any previous revision requests
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
        title: "Opportunity Approved! 🎉",
        content: `Great news! Your investment opportunity "${
          opportunity.title
        }" has been approved and is now live for investors.${
          validatedData.isFeatured
            ? " It has also been featured on the homepage!"
            : ""
        }`,
        userId: opportunity.ownerId,
      },
    });

    // Log admin action
    await logAdminAction({
      adminId: session.user.id,
      action: validatedData.isFeatured
        ? AdminActions.FEATURE_OPPORTUNITY
        : AdminActions.APPROVE_OPPORTUNITY,
      targetType: "BUSINESS",
      targetId: id,
      details: {
        opportunityTitle: opportunity.title,
        previousStatus: opportunity.status,
        newStatus: "OPEN",
        isFeatured: validatedData.isFeatured,
        adminNotes: validatedData.adminNotes,
      },
      ipAddress: getIpAddress(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json({
      success: true,
      message: "Opportunity approved successfully",
      opportunity: {
        id: updatedOpportunity.id,
        title: updatedOpportunity.title,
        status: updatedOpportunity.status,
        reviewedBy: updatedOpportunity.reviewedBy,
        reviewedAt: updatedOpportunity.reviewedAt,
        isFeatured: updatedOpportunity.isFeatured,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Opportunity approval error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
