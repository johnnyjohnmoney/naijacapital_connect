import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
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
        { error: "Only administrators can access financial statistics" },
        { status: 403 }
      );
    }

    const [
      totalWithdrawals,
      pendingWithdrawals,
      approvedWithdrawals,
      rejectedWithdrawals,
      totalInvestments,
      activeInvestments,
      completedInvestments,
      totalInvestmentVolume,
      pendingWithdrawalAmount,
      approvedWithdrawalAmount,
      recentWithdrawals,
      recentInvestments,
    ] = await Promise.all([
      // Withdrawal stats
      prisma.withdrawalRequest.count(),
      prisma.withdrawalRequest.count({ where: { status: "PENDING" } }),
      prisma.withdrawalRequest.count({ where: { status: "APPROVED" } }),
      prisma.withdrawalRequest.count({ where: { status: "REJECTED" } }),

      // Investment stats
      prisma.investment.count(),
      prisma.investment.count({ where: { status: "ACTIVE" } }),
      prisma.investment.count({ where: { status: "COMPLETED" } }),

      // Volume calculations
      prisma.investment.aggregate({
        _sum: {
          amount: true,
        },
      }),
      prisma.withdrawalRequest.aggregate({
        where: { status: "PENDING" },
        _sum: {
          amount: true,
        },
      }),
      prisma.withdrawalRequest.aggregate({
        where: { status: "APPROVED" },
        _sum: {
          amount: true,
        },
      }),

      // Recent activity
      prisma.withdrawalRequest.findMany({
        take: 10,
        orderBy: { requestDate: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.investment.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          investor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          business: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),
    ]);

    const stats = {
      withdrawals: {
        total: totalWithdrawals,
        pending: pendingWithdrawals,
        approved: approvedWithdrawals,
        rejected: rejectedWithdrawals,
        pendingAmount: pendingWithdrawalAmount._sum.amount || 0,
        approvedAmount: approvedWithdrawalAmount._sum.amount || 0,
      },
      investments: {
        total: totalInvestments,
        active: activeInvestments,
        completed: completedInvestments,
        totalVolume: totalInvestmentVolume._sum.amount || 0,
      },
      recent: {
        withdrawals: recentWithdrawals,
        investments: recentInvestments,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching financial statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch financial statistics" },
      { status: 500 }
    );
  }
}
