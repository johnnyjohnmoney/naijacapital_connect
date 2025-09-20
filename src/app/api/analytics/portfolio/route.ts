import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  calculatePortfolioMetrics,
  analyzeBySector,
  generateTimeSeriesData,
  type Investment,
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

    // Only allow investors to access portfolio analytics
    if (session.user.role !== "INVESTOR") {
      return NextResponse.json(
        { error: "Access denied. Investor role required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "12"; // months
    const includeReturns = searchParams.get("includeReturns") === "true";

    // Fetch user's investments with related data
    const investments = await prisma.investment.findMany({
      where: {
        investorId: session.user.id,
      },
      include: {
        business: {
          select: {
            title: true,
            industry: true,
          },
        },
        returns: includeReturns
          ? {
              select: {
                id: true,
                amount: true,
                description: true,
                createdAt: true,
              },
            }
          : false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform data to match analytics interface
    const analyticsData: Investment[] = investments.map((inv: any) => ({
      id: inv.id,
      amount: inv.amount,
      currentValue: inv.currentValue || inv.amount * 1.15, // Estimated growth if no current value
      investmentDate: inv.createdAt.toISOString(),
      status: inv.status,
      business: {
        title: inv.business.title,
        sector: inv.business.industry || "Unspecified",
      },
      returns:
        includeReturns && inv.returns
          ? inv.returns.map((ret: any) => ({
              id: ret.id,
              amount: ret.amount,
              date: ret.createdAt.toISOString(),
              type: ret.description || "Investment Return",
            }))
          : undefined,
    }));

    // Calculate portfolio metrics
    const portfolioMetrics = calculatePortfolioMetrics(analyticsData);

    // Calculate sector analysis
    const sectorAnalysis = analyzeBySector(analyticsData);

    // Generate time series data
    const timeSeriesMonths = parseInt(timeRange);
    const timeSeriesData = generateTimeSeriesData(
      analyticsData,
      timeSeriesMonths
    );

    return NextResponse.json({
      success: true,
      data: {
        portfolioMetrics,
        sectorAnalysis,
        timeSeriesData,
        investments: analyticsData,
        summary: {
          totalInvestments: investments.length,
          activeInvestments: investments.filter(
            (inv: any) => inv.status === "ACTIVE"
          ).length,
          totalInvested: portfolioMetrics.totalInvested,
          totalCurrentValue: portfolioMetrics.totalCurrentValue,
          totalReturns: portfolioMetrics.totalReturns,
        },
      },
    });
  } catch (error) {
    console.error("Portfolio analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio analytics" },
      { status: 500 }
    );
  }
}
