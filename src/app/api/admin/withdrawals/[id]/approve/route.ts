import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAction } from "@/lib/admin-audit";
import { z } from "zod";

const approveSchema = z.object({
  transactionId: z.string().min(1, "Transaction ID is required"),
  notes: z.string().optional(),
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
        { error: "Only administrators can approve withdrawals" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = approveSchema.parse(body);

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
        { error: `Cannot approve withdrawal with status ${withdrawal.status}` },
        { status: 400 }
      );
    }

    const updatedWithdrawal = await prisma.withdrawalRequest.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedBy: session.user.id,
        approvedAt: new Date(),
        transactionId: validatedData.transactionId,
        adminNotes: validatedData.notes,
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
      action: "APPROVE_WITHDRAWAL",
      targetType: "WITHDRAWAL",
      targetId: id,
      details: {
        withdrawalId: id,
        userId: withdrawal.userId,
        userName: withdrawal.user.name,
        amount: withdrawal.amount,
        transactionId: validatedData.transactionId,
        notes: validatedData.notes,
      },
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    // TODO: Process actual withdrawal/payout
    // TODO: Send email notification to user

    return NextResponse.json({
      success: true,
      message: "Withdrawal approved successfully",
      withdrawal: updatedWithdrawal,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error approving withdrawal:", error);
    return NextResponse.json(
      { error: "Failed to approve withdrawal" },
      { status: 500 }
    );
  }
}
