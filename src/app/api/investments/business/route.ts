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
      // Business owners can only see investments in their own opportunities
      where = {
        business: {
          ownerId: session.user.id,
        },
      };
    }
    // Administrators can see all investments (no additional where clause needed)

    // Add status filter if provided
    if (
      status &&
      ["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"].includes(status)
    ) {
      where.status = status;
    }

    // Get investments with business and investor details
    const investments = await prisma.investment.findMany({
      where,
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
            industry: true,
            expectedROI: true,
            timeline: true,
            riskLevel: true,
            status: true,
            ownerId: true,
            owner: {
              select: {
                name: true,
              },
            },
          },
        },
        returns: {
          orderBy: {
            createdAt: "desc",
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
    const totalCount = await prisma.investment.count({ where });

    // Calculate summary statistics
    const totalAmount = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const pendingInvestments = investments.filter(
      (inv) => inv.status === "PENDING"
    ).length;
    const activeInvestments = investments.filter(
      (inv) => inv.status === "ACTIVE"
    ).length;
    const totalReturns = investments.reduce(
      (sum, inv) =>
        sum + inv.returns.reduce((returnSum, ret) => returnSum + ret.amount, 0),
      0
    );

    return NextResponse.json({
      investments,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
      summary: {
        totalInvested: totalAmount,
        totalReturns,
        totalValue: totalAmount + totalReturns,
        pendingInvestments,
        activeInvestments,
      },
    });
  } catch (error) {
    console.error("Get business investments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
