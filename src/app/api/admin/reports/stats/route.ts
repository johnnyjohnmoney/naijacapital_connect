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
        { error: "Only administrators can access report statistics" },
        { status: 403 }
      );
    }

    const [
      totalReports,
      pendingReports,
      underReviewReports,
      resolvedReports,
      dismissedReports,
      reportsByPriority,
      reportsByTargetType,
      recentReports,
    ] = await Promise.all([
      prisma.reportedContent.count(),
      prisma.reportedContent.count({ where: { status: "PENDING" } }),
      prisma.reportedContent.count({ where: { status: "UNDER_REVIEW" } }),
      prisma.reportedContent.count({ where: { status: "RESOLVED" } }),
      prisma.reportedContent.count({ where: { status: "DISMISSED" } }),
      prisma.reportedContent.groupBy({
        by: ["priority"],
        _count: true,
      }),
      prisma.reportedContent.groupBy({
        by: ["targetType"],
        _count: true,
      }),
      prisma.reportedContent.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          reportedBy: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
    ]);

    const stats = {
      total: totalReports,
      byStatus: {
        pending: pendingReports,
        underReview: underReviewReports,
        resolved: resolvedReports,
        dismissed: dismissedReports,
      },
      byPriority: reportsByPriority.reduce((acc, item) => {
        acc[item.priority] = item._count;
        return acc;
      }, {} as Record<string, number>),
      byTargetType: reportsByTargetType.reduce((acc, item) => {
        acc[item.targetType] = item._count;
        return acc;
      }, {} as Record<string, number>),
      recent: recentReports,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching report statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch report statistics" },
      { status: 500 }
    );
  }
}
