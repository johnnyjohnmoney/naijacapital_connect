import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const cancelRequestSchema = z.object({
  reason: z
    .string()
    .min(20, "Cancellation reason must be at least 20 characters"),
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

    if (session.user.role !== "BUSINESS_OWNER") {
      return NextResponse.json(
        { error: "Only business owners can request cancellation" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = cancelRequestSchema.parse(body);

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
        {
          error: "You can only request cancellation for your own opportunities",
        },
        { status: 403 }
      );
    }

    // Check if already requested cancellation
    if (opportunity.status === "SUSPENDED") {
      return NextResponse.json(
        { error: "Cancellation already requested and pending admin review" },
        { status: 400 }
      );
    }

    if (opportunity.status === "CANCELLED") {
      return NextResponse.json(
        { error: "This opportunity is already cancelled" },
        { status: 400 }
      );
    }

    // Update status to SUSPENDED (pending admin review for cancellation)
    const updatedOpportunity = await prisma.business.update({
      where: { id },
      data: {
        status: "SUSPENDED",
        adminNotes: `Cancellation requested by business owner. Reason: ${validatedData.reason}`,
      },
    });

    // Create notification for business owner
    await prisma.notification.create({
      data: {
        title: "Cancellation Request Submitted",
        content: `Your cancellation request for "${
          opportunity.title
        }" has been submitted and is pending admin review. ${
          opportunity._count.investments > 0
            ? "Administrators will review the request considering the active investments."
            : ""
        }`,
        userId: session.user.id!,
      },
    });

    // TODO: Notify admins about the cancellation request
    // Could create a notification for all admins or send email

    return NextResponse.json({
      success: true,
      message: "Cancellation request submitted successfully",
      opportunity: {
        id: updatedOpportunity.id,
        status: updatedOpportunity.status,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error requesting cancellation:", error);
    return NextResponse.json(
      { error: "Failed to request cancellation" },
      { status: 500 }
    );
  }
}
