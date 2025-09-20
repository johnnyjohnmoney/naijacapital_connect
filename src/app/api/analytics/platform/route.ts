import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  calculatePlatformMetrics,
  type PlatformMetrics,
} from "@/lib/analytics";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Only allow administrators to access platform analytics
    if (session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json(
        { error: "Access denied. Administrator role required." },
        { status: 403 }
      );
    }

    // Fetch platform-wide data
    const [users, businesses, investments] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.business.findMany({
        select: {
          id: true,
          title: true,
          industry: true,
          targetCapital: true,
          currentRaised: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.investment.findMany({
        select: {
          id: true,
          amount: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    // Calculate platform metrics
    const platformMetrics = calculatePlatformMetrics(
      users,
      businesses,
      investments
    );

    // Calculate additional admin-specific metrics
    const usersByRole = users.reduce((acc: any, user: any) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    const businessesByIndustry = businesses.reduce(
      (acc: any, business: any) => {
        acc[business.industry] = (acc[business.industry] || 0) + 1;
        return acc;
      },
      {}
    );

    const investmentsByStatus = investments.reduce(
      (acc: any, investment: any) => {
        acc[investment.status] = (acc[investment.status] || 0) + 1;
        return acc;
      },
      {}
    );

    // Calculate growth metrics
    const currentMonth = new Date();
    const lastMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    const lastYear = new Date(
      currentMonth.getFullYear() - 1,
      currentMonth.getMonth(),
      1
    );

    const newUsersThisMonth = users.filter(
      (user) => new Date(user.createdAt) >= lastMonth
    ).length;
    const newBusinessesThisMonth = businesses.filter(
      (business) => new Date(business.createdAt) >= lastMonth
    ).length;
    const newInvestmentsThisMonth = investments.filter(
      (investment) => new Date(investment.createdAt) >= lastMonth
    ).length;

    const newUsersLastYear = users.filter(
      (user) => new Date(user.createdAt) >= lastYear
    ).length;
    const newBusinessesLastYear = businesses.filter(
      (business) => new Date(business.createdAt) >= lastYear
    ).length;
    const newInvestmentsLastYear = investments.filter(
      (investment) => new Date(investment.createdAt) >= lastYear
    ).length;

    // Calculate recent activity
    const recentUsers = users
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10);

    const recentBusinesses = businesses
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10);

    const recentInvestments = investments
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      data: {
        platformMetrics,
        overview: {
          totalUsers: users.length,
          totalBusinesses: businesses.length,
          totalInvestments: investments.length,
          totalVolume: investments.reduce((sum, inv) => sum + inv.amount, 0),
        },
        distributions: {
          usersByRole,
          businessesByIndustry,
          investmentsByStatus,
        },
        growth: {
          monthly: {
            newUsers: newUsersThisMonth,
            newBusinesses: newBusinessesThisMonth,
            newInvestments: newInvestmentsThisMonth,
          },
          yearly: {
            newUsers: newUsersLastYear,
            newBusinesses: newBusinessesLastYear,
            newInvestments: newInvestmentsLastYear,
          },
        },
        recentActivity: {
          users: recentUsers,
          businesses: recentBusinesses,
          investments: recentInvestments,
        },
      },
    });
  } catch (error) {
    console.error("Platform analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch platform analytics" },
      { status: 500 }
    );
  }
}
