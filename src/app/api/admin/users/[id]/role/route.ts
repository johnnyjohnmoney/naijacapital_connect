import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAction } from "@/lib/admin-audit";
import { z } from "zod";

const roleSchema = z.object({
  role: z.enum(["INVESTOR", "BUSINESS_OWNER", "ADMINISTRATOR"]),
  reason: z.string().min(10, "Reason must be at least 10 characters"),
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
        { error: "Only administrators can change user roles" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = roleSchema.parse(body);

    // Prevent changing own role
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot change your own role" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === validatedData.role) {
      return NextResponse.json(
        { error: `User already has role ${validatedData.role}` },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        role: validatedData.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    await logAdminAction({
      adminId: session.user.id!,
      action: "CHANGE_USER_ROLE",
      targetType: "USER",
      targetId: id,
      details: {
        userName: user.name,
        userEmail: user.email,
        oldRole: user.role,
        newRole: validatedData.role,
        reason: validatedData.reason,
      },
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
