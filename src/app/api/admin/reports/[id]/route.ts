import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAction } from "@/lib/admin-audit";
import { z } from "zod";

const updateReportSchema = z.object({
  status: z.enum(["UNDER_REVIEW", "RESOLVED", "DISMISSED"]),
  resolution: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
        { error: "Only administrators can update reports" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateReportSchema.parse(body);

    const report = await prisma.reportedContent.findUnique({
      where: { id },
      include: {
        reportedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const updatedReport = await prisma.reportedContent.update({
      where: { id },
      data: {
        status: validatedData.status,
        resolution: validatedData.resolution,
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
      },
      include: {
        reportedBy: {
          select: { id: true, name: true, email: true },
        },
        reviewer: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    await logAdminAction({
      adminId: session.user.id!,
      action: "REVIEW_REPORT",
      targetType: "REPORT",
      targetId: id,
      details: {
        reportId: id,
        newStatus: validatedData.status,
        resolution: validatedData.resolution,
        reportReason: report.reportReason,
        reportTargetType: report.targetType,
        reportTargetId: report.targetId,
      },
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    // TODO: Notify reporter about report status update

    return NextResponse.json({
      success: true,
      message: "Report updated successfully",
      report: updatedReport,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating report:", error);
    return NextResponse.json(
      { error: "Failed to update report" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
        { error: "Only administrators can delete reports" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const report = await prisma.reportedContent.findUnique({
      where: { id },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    await prisma.reportedContent.delete({
      where: { id },
    });

    await logAdminAction({
      adminId: session.user.id!,
      action: "DELETE_REPORT",
      targetType: "REPORT",
      targetId: id,
      details: {
        reportId: id,
        reportReason: report.reportReason,
        reportTargetType: report.targetType,
        reportTargetId: report.targetId,
      },
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting report:", error);
    return NextResponse.json(
      { error: "Failed to delete report" },
      { status: 500 }
    );
  }
}
