import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAction } from "@/lib/admin-audit";
import { z } from "zod";

const suspendSchema = z.object({
  reason: z
    .string()
    .min(10, "Suspension reason must be at least 10 characters"),
  duration: z.enum(["temporary", "permanent"]).optional().default("temporary"),
  durationDays: z.number().min(1).max(365).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Only administrators can suspend users
    if (session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json(
        { error: "Only administrators can suspend users" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = suspendSchema.parse(body);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        suspended: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent suspending other administrators
    if (user.role === "ADMINISTRATOR") {
      return NextResponse.json(
        { error: "Cannot suspend administrator accounts" },
        { status: 403 }
      );
    }

    // Prevent suspending already suspended users
    if (user.suspended) {
      return NextResponse.json(
        { error: "User is already suspended" },
        { status: 400 }
      );
    }

    // Calculate suspension end date for temporary suspensions
    let suspensionEndsAt = null;
    if (validatedData.duration === "temporary" && validatedData.durationDays) {
      suspensionEndsAt = new Date();
      suspensionEndsAt.setDate(
        suspensionEndsAt.getDate() + validatedData.durationDays
      );
    }

    // Update user status
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        suspended: true,
        suspensionReason: validatedData.reason,
        suspendedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        suspended: true,
        suspensionReason: true,
        suspendedAt: true,
      },
    });

    // Log admin action
    await logAdminAction({
      adminId: session.user.id!,
      action: "SUSPEND_USER",
      targetType: "USER",
      targetId: id,
      details: {
        reason: validatedData.reason,
        duration: validatedData.duration,
        durationDays: validatedData.durationDays,
        suspensionEndsAt,
        userName: user.name,
        userEmail: user.email,
      },
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    // TODO: Send email notification to suspended user

    return NextResponse.json({
      success: true,
      message: "User suspended successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error suspending user:", error);
    return NextResponse.json(
      { error: "Failed to suspend user" },
      { status: 500 }
    );
  }
}

// Unsuspend user endpoint
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
        { error: "Only administrators can unsuspend users" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        suspended: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.suspended) {
      return NextResponse.json(
        { error: "User is not suspended" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        suspended: false,
        suspensionReason: null,
        suspendedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        suspended: true,
      },
    });

    await logAdminAction({
      adminId: session.user.id!,
      action: "UNSUSPEND_USER",
      targetType: "USER",
      targetId: id,
      details: {
        userName: user.name,
        userEmail: user.email,
      },
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message: "User unsuspended successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error unsuspending user:", error);
    return NextResponse.json(
      { error: "Failed to unsuspend user" },
      { status: 500 }
    );
  }
}
