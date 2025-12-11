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

const requestChangesSchema = z.object({
  revisionRequests: z
    .string()
    .min(20, "Revision requests must be at least 20 characters and specific"),
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

    // Only administrators can request changes
    if (session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json(
        { error: "Only administrators can request changes to opportunities" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = requestChangesSchema.parse(body);

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

    // Check if opportunity is in a valid state for requesting changes
    if (
      opportunity.status !== "PENDING_REVIEW" &&
      opportunity.status !== "NEEDS_REVISION"
    ) {
      return NextResponse.json(
        {
          error: `Cannot request changes for opportunity with status: ${opportunity.status}`,
        },
        { status: 400 }
      );
    }

    // Update opportunity to NEEDS_REVISION status
    const updatedOpportunity = await prisma.business.update({
      where: { id },
      data: {
        status: "NEEDS_REVISION",
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
        revisionRequests: validatedData.revisionRequests,
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
        title: "Opportunity Requires Revisions",
        content: `Your investment opportunity "${opportunity.title}" needs some changes before approval. Please review the feedback and update your submission.\n\nFeedback: ${validatedData.revisionRequests}`,
        userId: opportunity.ownerId,
      },
    });

    // Log admin action
    await logAdminAction({
      adminId: session.user.id,
      action: AdminActions.REQUEST_CHANGES_OPPORTUNITY,
      targetType: "BUSINESS",
      targetId: id,
      details: {
        opportunityTitle: opportunity.title,
        previousStatus: opportunity.status,
        newStatus: "NEEDS_REVISION",
        revisionRequests: validatedData.revisionRequests,
        adminNotes: validatedData.adminNotes,
      },
      ipAddress: getIpAddress(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json({
      success: true,
      message: "Revision requests sent to business owner",
      opportunity: {
        id: updatedOpportunity.id,
        title: updatedOpportunity.title,
        status: updatedOpportunity.status,
        reviewedBy: updatedOpportunity.reviewedBy,
        reviewedAt: updatedOpportunity.reviewedAt,
        revisionRequests: updatedOpportunity.revisionRequests,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Request changes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
