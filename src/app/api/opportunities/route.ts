import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Opportunity creation validation schema
const opportunitySchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description is too long"),
  detailedPlan: z
    .string()
    .min(50, "Detailed plan must be at least 50 characters")
    .max(5000, "Detailed plan is too long"),
  targetCapital: z
    .number()
    .min(1000, "Target capital must be at least ₦1,000")
    .max(1000000000, "Target capital cannot exceed ₦1B"),
  minimumInvestment: z
    .number()
    .min(100, "Minimum investment must be at least ₦100"),
  expectedROI: z
    .number()
    .min(0, "Expected ROI cannot be negative")
    .max(1000, "Expected ROI cannot exceed 1000%"),
  timeline: z
    .number()
    .min(1, "Timeline must be at least 1 month")
    .max(120, "Timeline cannot exceed 120 months"),
  industry: z.string().min(1, "Industry is required"),
  riskLevel: z.enum(["Low", "Medium", "High"]),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get("industry");
    const riskLevel = searchParams.get("riskLevel");
    const minAmount = searchParams.get("minAmount");
    const maxAmount = searchParams.get("maxAmount");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: any = {
      status: "OPEN",
    };

    if (industry && industry !== "all") {
      where.industry = industry;
    }

    if (riskLevel && riskLevel !== "all") {
      where.riskLevel = riskLevel;
    }

    if (minAmount) {
      where.minimumInvestment = {
        gte: parseFloat(minAmount),
      };
    }

    if (maxAmount) {
      where.targetCapital = {
        lte: parseFloat(maxAmount),
      };
    }

    // Get total count for pagination
    const total = await prisma.business.count({ where });

    // Get businesses with pagination
    const businesses = await prisma.business.findMany({
      where,
      include: {
        owner: {
          select: {
            name: true,
            id: true,
          },
        },
        _count: {
          select: {
            investments: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      businesses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    return NextResponse.json(
      { error: "Failed to fetch opportunities" },
      { status: 500 }
    );
  }
}

// Create new opportunity (for business owners)
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

    // Only business owners can create opportunities
    if (session.user.role !== "BUSINESS_OWNER") {
      return NextResponse.json(
        { error: "Only business owners can create opportunities" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = opportunitySchema.parse(body);

    // Validate that minimum investment is not greater than target capital
    if (validatedData.minimumInvestment > validatedData.targetCapital) {
      return NextResponse.json(
        { error: "Minimum investment cannot be greater than target capital" },
        { status: 400 }
      );
    }

    // Create the business opportunity
    const business = await prisma.business.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        detailedPlan: validatedData.detailedPlan,
        targetCapital: validatedData.targetCapital,
        minimumInvestment: validatedData.minimumInvestment,
        expectedROI: validatedData.expectedROI,
        timeline: validatedData.timeline,
        industry: validatedData.industry,
        riskLevel: validatedData.riskLevel,
        status: "OPEN",
        currentRaised: 0,
        ownerId: session.user.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create notification for successful creation
    await prisma.notification.create({
      data: {
        title: "Opportunity Created",
        content: `Your investment opportunity "${validatedData.title}" has been successfully created and is now live for investors.`,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Opportunity created successfully",
        business: {
          id: business.id,
          title: business.title,
          targetCapital: business.targetCapital,
          minimumInvestment: business.minimumInvestment,
          status: business.status,
          createdAt: business.createdAt,
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

    console.error("Opportunity creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
