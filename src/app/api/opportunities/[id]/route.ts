import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
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

    if (session.user.role !== "BUSINESS_OWNER") {
      return NextResponse.json(
        { error: "Only business owners can delete opportunities" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Get the opportunity
    const opportunity = await prisma.business.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            investments: true,
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

    // Check ownership
    if (opportunity.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own opportunities" },
        { status: 403 }
      );
    }

    // Check if opportunity can be deleted
    const hasInvestments = opportunity._count.investments > 0;
    const isApproved =
      opportunity.status === "OPEN" || opportunity.status === "FULLY_FUNDED";

    if (hasInvestments || isApproved) {
      return NextResponse.json(
        {
          error:
            "Cannot delete opportunity with investments or approved status",
          message:
            "This opportunity has active investments or has been approved. Please request cancellation instead.",
          requiresCancellation: true,
        },
        { status: 400 }
      );
    }

    // Only allow deletion if status is PENDING_REVIEW or NEEDS_REVISION and no investments
    if (
      opportunity.status !== "PENDING_REVIEW" &&
      opportunity.status !== "NEEDS_REVISION" &&
      opportunity.status !== "REJECTED"
    ) {
      return NextResponse.json(
        {
          error: "Cannot delete opportunity in current status",
          message: `Opportunities with status ${opportunity.status} cannot be deleted. Please request cancellation instead.`,
          requiresCancellation: true,
        },
        { status: 400 }
      );
    }

    // Delete the opportunity (cascade will handle related records)
    await prisma.business.delete({
      where: { id },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        title: "Opportunity Deleted",
        content: `Your opportunity "${opportunity.title}" has been successfully deleted.`,
        userId: session.user.id!,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Opportunity deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting opportunity:", error);
    return NextResponse.json(
      { error: "Failed to delete opportunity" },
      { status: 500 }
    );
  }
}
