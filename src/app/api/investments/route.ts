import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Investment submission validation schema
const investmentSchema = z.object({
  businessId: z.string().min(1, "Business ID is required"),
  amount: z.number().min(1, "Investment amount must be greater than 0"),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Only investors can make investments
    if (session.user.role !== "INVESTOR") {
      return NextResponse.json(
        { error: "Only investors can make investments" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = investmentSchema.parse(body);

    // Get the business opportunity
    const business = await prisma.business.findUnique({
      where: { id: validatedData.businessId },
      include: {
        owner: true,
        investments: true,
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business opportunity not found" },
        { status: 404 }
      );
    }

    // Check if business is still open for investment
    if (business.status !== "OPEN") {
      return NextResponse.json(
        { error: "This investment opportunity is no longer open" },
        { status: 400 }
      );
    }

    // Validate minimum investment amount
    if (validatedData.amount < business.minimumInvestment) {
      return NextResponse.json(
        {
          error: `Minimum investment amount is ₦${business.minimumInvestment.toLocaleString()}`,
        },
        { status: 400 }
      );
    }

    // Check if investment would exceed target capital
    const totalAfterInvestment = business.currentRaised + validatedData.amount;
    if (totalAfterInvestment > business.targetCapital) {
      const remainingAmount = business.targetCapital - business.currentRaised;
      return NextResponse.json(
        {
          error: `Investment amount exceeds remaining capacity. Maximum available: ₦${remainingAmount.toLocaleString()}`,
        },
        { status: 400 }
      );
    }

    // Check if user has already invested in this business
    const existingInvestment = await prisma.investment.findFirst({
      where: {
        investorId: session.user.id,
        businessId: validatedData.businessId,
        status: {
          in: ["PENDING", "ACTIVE"],
        },
      },
    });

    if (existingInvestment) {
      return NextResponse.json(
        { error: "You already have an active investment in this opportunity" },
        { status: 400 }
      );
    }

    // Create the investment
    const investment = await prisma.investment.create({
      data: {
        amount: validatedData.amount,
        status: "PENDING",
        investorId: session.user.id,
        businessId: validatedData.businessId,
      },
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
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Update the business currentRaised amount
    await prisma.business.update({
      where: { id: validatedData.businessId },
      data: {
        currentRaised: {
          increment: validatedData.amount,
        },
      },
    });

    // Create notification for business owner
    await prisma.notification.create({
      data: {
        title: "New Investment Received",
        content: `${
          session.user.name
        } has invested ₦${validatedData.amount.toLocaleString()} in ${
          business.title
        }`,
        userId: business.ownerId,
      },
    });

    // Create notification for investor
    await prisma.notification.create({
      data: {
        title: "Investment Submitted",
        content: `Your investment of ₦${validatedData.amount.toLocaleString()} in ${
          business.title
        } is pending approval`,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Investment submitted successfully",
        investment: {
          id: investment.id,
          amount: investment.amount,
          status: investment.status,
          businessTitle: investment.business.title,
          createdAt: investment.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Investment creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get user's investments
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      investorId: session.user.id,
    };

    if (
      status &&
      ["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"].includes(status)
    ) {
      where.status = status;
    }

    // Get investments with business details
    const investments = await prisma.investment.findMany({
      where,
      include: {
        business: {
          select: {
            id: true,
            title: true,
            industry: true,
            expectedROI: true,
            timeline: true,
            riskLevel: true,
            status: true,
            owner: {
              select: {
                name: true,
              },
            },
          },
        },
        returns: true,
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
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
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
        totalInvested,
        totalReturns,
        totalValue: totalInvested + totalReturns,
        activeInvestments: investments.filter((inv) => inv.status === "ACTIVE")
          .length,
      },
    });
  } catch (error) {
    console.error("Get investments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
