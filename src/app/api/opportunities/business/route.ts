import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Only business owners and administrators can access this endpoint
    if (
      session.user.role !== "BUSINESS_OWNER" &&
      session.user.role !== "ADMINISTRATOR"
    ) {
      return NextResponse.json(
        {
          error:
            "Access denied. Business owner or administrator role required.",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    // Build where clause based on user role
    let where: any = {};

    if (session.user.role === "BUSINESS_OWNER") {
      // Business owners can only see their own opportunities
      where = {
        ownerId: session.user.id,
      };
    }
    // Administrators can see all opportunities (no additional where clause needed)

    // Add status filter if provided
    if (status && status !== "ALL") {
      where.status = status;
    }

    // Get opportunities with investment details
    const opportunities = await prisma.business.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        investments: {
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
            investor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
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
      skip,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await prisma.business.count({ where });

    // Calculate summary statistics
    const totalOpportunities = opportunities.length;
    const totalTargetCapital = opportunities.reduce(
      (sum, opp) => sum + opp.targetCapital,
      0
    );
    const totalRaised = opportunities.reduce(
      (sum, opp) => sum + opp.currentRaised,
      0
    );
    const activeOpportunities = opportunities.filter(
      (opp) => opp.status === "OPEN"
    ).length;
    const totalInvestors = opportunities.reduce(
      (sum, opp) => sum + opp._count.investments,
      0
    );
    const pendingInvestments = opportunities.reduce(
      (sum, opp) =>
        sum + opp.investments.filter((inv) => inv.status === "PENDING").length,
      0
    );

    return NextResponse.json({
      opportunities,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
      summary: {
        totalOpportunities,
        totalTargetCapital,
        totalRaised,
        activeOpportunities,
        totalInvestors,
        pendingInvestments,
      },
    });
  } catch (error) {
    console.error("Get business opportunities error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
