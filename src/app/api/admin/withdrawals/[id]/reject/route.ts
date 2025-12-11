import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAction } from "@/lib/admin-audit";
import { z } from "zod";

const rejectSchema = z.object({
  reason: z.string().min(10, "Rejection reason must be at least 10 characters"),
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
        { error: "Only administrators can reject withdrawals" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = rejectSchema.parse(body);

    const withdrawal = await prisma.withdrawalRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!withdrawal) {
      return NextResponse.json(
        { error: "Withdrawal request not found" },
        { status: 404 }
      );
    }

    if (withdrawal.status !== "PENDING") {
      return NextResponse.json(
        { error: `Cannot reject withdrawal with status ${withdrawal.status}` },
        { status: 400 }
      );
    }

    const updatedWithdrawal = await prisma.withdrawalRequest.update({
      where: { id },
      data: {
        status: "REJECTED",
        approvedBy: session.user.id,
        approvedAt: new Date(),
        adminNotes: validatedData.reason,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await logAdminAction({
      adminId: session.user.id!,
      action: "REJECT_WITHDRAWAL",
      targetType: "WITHDRAWAL",
      targetId: id,
      details: {
        withdrawalId: id,
        userId: withdrawal.userId,
        userName: withdrawal.user.name,
        amount: withdrawal.amount,
        reason: validatedData.reason,
      },
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    // TODO: Send email notification to user

    return NextResponse.json({
      success: true,
      message: "Withdrawal rejected successfully",
      withdrawal: updatedWithdrawal,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error rejecting withdrawal:", error);
    return NextResponse.json(
      { error: "Failed to reject withdrawal" },
      { status: 500 }
    );
  }
}
