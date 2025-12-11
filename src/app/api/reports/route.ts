import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createReportSchema = z.object({
  targetType: z.string(),
  targetId: z.string(),
  reportReason: z
    .string()
    .min(20, "Report reason must be at least 20 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
    .optional()
    .default("MEDIUM"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createReportSchema.parse(body);

    // Check if user has already reported this content
    const existingReport = await prisma.reportedContent.findFirst({
      where: {
        reportedById: session.user.id,
        targetType: validatedData.targetType,
        targetId: validatedData.targetId,
        status: {
          in: ["PENDING", "UNDER_REVIEW"],
        },
      },
    });

    if (existingReport) {
      return NextResponse.json(
        { error: "You have already reported this content" },
        { status: 400 }
      );
    }

    // Verify target exists based on type
    let targetExists = false;
    let targetTitle = "";

    switch (validatedData.targetType) {
      case "USER":
        const user = await prisma.user.findUnique({
          where: { id: validatedData.targetId },
          select: { name: true },
        });
        if (user) {
          targetExists = true;
          targetTitle = user.name;
        }
        break;

      case "BUSINESS":
      case "OPPORTUNITY":
        const business = await prisma.business.findUnique({
          where: { id: validatedData.targetId },
          select: { title: true },
        });
        if (business) {
          targetExists = true;
          targetTitle = business.title;
        }
        break;

      case "OTHER":
        targetExists = true;
        targetTitle = "Other Report";
        break;
    }

    if (!targetExists) {
      return NextResponse.json(
        { error: "Reported content not found" },
        { status: 404 }
      );
    }

    // Create report
    const report = await prisma.reportedContent.create({
      data: {
        reportType: "USER_REPORT",
        targetType: validatedData.targetType,
        targetId: validatedData.targetId,
        reportedById: session.user.id!,
        reportReason: validatedData.reportReason,
        description: validatedData.description,
        priority: validatedData.priority,
        status: "PENDING",
      },
      include: {
        reportedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // TODO: Notify administrators about new report

    return NextResponse.json({
      success: true,
      message: "Report submitted successfully",
      report: {
        id: report.id,
        status: report.status,
        createdAt: report.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Failed to submit report" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || "";
    const priority = searchParams.get("priority") || "";
    const targetType = searchParams.get("targetType") || "";

    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: any = {};

    // Only admins can see all reports, users can only see their own
    if (session.user.role === "ADMINISTRATOR") {
      // Admin can filter by status, priority, targetType
      if (status && status !== "all") {
        where.status = status;
      }
      if (priority && priority !== "all") {
        where.priority = priority;
      }
      if (targetType && targetType !== "all") {
        where.targetType = targetType;
      }
    } else {
      // Regular users can only see their own reports
      where.reportedById = session.user.id;
    }

    const [reports, total] = await Promise.all([
      prisma.reportedContent.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          reportedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          reviewer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.reportedContent.count({ where }),
    ]);

    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
