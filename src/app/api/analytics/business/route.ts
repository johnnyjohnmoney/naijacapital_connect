import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  calculateBusinessMetrics,
  type BusinessMetrics,
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

    // Only allow business owners to access business analytics
    if (session.user.role !== "BUSINESS_OWNER") {
      return NextResponse.json(
        { error: "Access denied. Business owner role required." },
        { status: 403 }
      );
    }

    // Fetch user's business opportunities
    const opportunities = await prisma.business.findMany({
      where: {
        ownerId: session.user.id,
      },
      include: {
        investments: {
          include: {
            investor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            returns: true,
          },
        },
        _count: {
          select: {
            investments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Flatten all investments from all opportunities
    const allInvestments = opportunities.flatMap((opp) =>
      opp.investments.map((inv: any) => ({
        ...inv,
        business: {
          title: opp.title,
          industry: opp.industry,
        },
      }))
    );

    // Calculate business metrics
    const businessMetrics = calculateBusinessMetrics(
      opportunities,
      allInvestments
    );

    // Calculate summary statistics
    const totalCapitalRaised = allInvestments.reduce(
      (sum: number, inv: any) => sum + inv.amount,
      0
    );
    const totalTargetCapital = opportunities.reduce(
      (sum: any, opp: any) => sum + opp.targetCapital,
      0
    );
    const totalInvestors = new Set(
      allInvestments.map((inv: any) => inv.investor?.id)
    ).size;
    const pendingInvestments = allInvestments.filter(
      (inv: any) => inv.status === "PENDING"
    ).length;

    // Calculate investor metrics by month for trends
    const monthlyMetrics = calculateMonthlyMetrics(allInvestments);

    return NextResponse.json({
      success: true,
      data: {
        businessMetrics,
        opportunities: opportunities.map((opp) => ({
          id: opp.id,
          title: opp.title,
          targetCapital: opp.targetCapital,
          currentRaised: opp.currentRaised,
          status: opp.status,
          createdAt: opp.createdAt,
          investmentCount: opp._count.investments,
        })),
        summary: {
          totalOpportunities: opportunities.length,
          totalCapitalRaised,
          totalTargetCapital,
          totalInvestors,
          pendingInvestments,
          activeOpportunities: opportunities.filter(
            (opp) => opp.status === "OPEN"
          ).length,
        },
        recentInvestments: allInvestments.slice(0, 10).map((inv: any) => ({
          id: inv.id,
          amount: inv.amount,
          status: inv.status,
          createdAt: inv.createdAt,
          investor: inv.investor,
          business: inv.business,
        })),
        monthlyTrends: monthlyMetrics,
      },
    });
  } catch (error) {
    console.error("Business analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch business analytics" },
      { status: 500 }
    );
  }
}

// Helper function to calculate monthly metrics
function calculateMonthlyMetrics(investments: any[]) {
  const monthlyData = new Map();

  investments.forEach((inv: any) => {
    const month = new Date(inv.createdAt).toISOString().slice(0, 7); // YYYY-MM
    const existing = monthlyData.get(month) || {
      month,
      newInvestments: 0,
      totalAmount: 0,
      newInvestors: new Set(),
    };

    existing.newInvestments += 1;
    existing.totalAmount += inv.amount;
    existing.newInvestors.add(inv.investor?.id);

    monthlyData.set(month, existing);
  });

  return Array.from(monthlyData.values())
    .map((data) => ({
      month: data.month,
      newInvestments: data.newInvestments,
      totalAmount: data.totalAmount,
      newInvestors: data.newInvestors.size,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}
