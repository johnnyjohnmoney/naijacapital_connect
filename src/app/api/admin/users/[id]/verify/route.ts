import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAction } from "@/lib/admin-audit";
import { z } from "zod";

const verifySchema = z.object({
  notes: z.string().optional(),
});

export async function POST(
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
        { error: "Only administrators can verify users" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = verifySchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        verified: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.verified) {
      return NextResponse.json(
        { error: "User is already verified" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        verified: true,
        verificationNotes: validatedData.notes,
      },
      select: {
        id: true,
        name: true,
        email: true,
        verified: true,
      },
    });

    await logAdminAction({
      adminId: session.user.id!,
      action: "VERIFY_USER",
      targetType: "USER",
      targetId: id,
      details: {
        userName: user.name,
        userEmail: user.email,
        notes: validatedData.notes,
      },
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message: "User verified successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error verifying user:", error);
    return NextResponse.json(
      { error: "Failed to verify user" },
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
        { error: "Only administrators can unverify users" },
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
        verified: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.verified) {
      return NextResponse.json(
        { error: "User is not verified" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        verified: false,
        verificationNotes: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        verified: true,
      },
    });

    await logAdminAction({
      adminId: session.user.id!,
      action: "UNVERIFY_USER",
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
      message: "User verification removed successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error unverifying user:", error);
    return NextResponse.json(
      { error: "Failed to unverify user" },
      { status: 500 }
    );
  }
}
