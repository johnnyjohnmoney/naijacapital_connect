import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAction } from "@/lib/admin-audit";
import { z } from "zod";

const updateSettingSchema = z.object({
  value: z.string().min(1, "Value is required"),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
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
        { error: "Only administrators can update platform settings" },
        { status: 403 }
      );
    }

    const { key } = await params;
    const body = await request.json();
    const validatedData = updateSettingSchema.parse(body);

    const existingSetting = await prisma.platformSettings.findUnique({
      where: { key },
    });

    if (!existingSetting) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 });
    }

    // Validate value based on dataType
    let parsedValue = validatedData.value;
    if (existingSetting.dataType === "NUMBER") {
      const num = parseFloat(validatedData.value);
      if (isNaN(num)) {
        return NextResponse.json(
          { error: "Value must be a valid number" },
          { status: 400 }
        );
      }
      parsedValue = num.toString();
    } else if (existingSetting.dataType === "BOOLEAN") {
      if (validatedData.value !== "true" && validatedData.value !== "false") {
        return NextResponse.json(
          { error: "Value must be 'true' or 'false'" },
          { status: 400 }
        );
      }
    } else if (existingSetting.dataType === "JSON") {
      try {
        JSON.parse(validatedData.value);
      } catch {
        return NextResponse.json(
          { error: "Value must be valid JSON" },
          { status: 400 }
        );
      }
    }

    const updatedSetting = await prisma.platformSettings.update({
      where: { key },
      data: {
        value: parsedValue,
        updatedBy: session.user.id!,
      },
      include: {
        updater: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await logAdminAction({
      adminId: session.user.id!,
      action: "UPDATE_SETTING",
      targetType: "SETTINGS",
      targetId: key,
      details: {
        key,
        oldValue: existingSetting.value,
        newValue: parsedValue,
        category: existingSetting.category,
      },
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message: "Setting updated successfully",
      setting: updatedSetting,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating setting:", error);
    return NextResponse.json(
      { error: "Failed to update setting" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
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
        { error: "Only administrators can view platform settings" },
        { status: 403 }
      );
    }

    const { key } = await params;

    const setting = await prisma.platformSettings.findUnique({
      where: { key },
      include: {
        updater: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!setting) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 });
    }

    return NextResponse.json({ setting });
  } catch (error) {
    console.error("Error fetching setting:", error);
    return NextResponse.json(
      { error: "Failed to fetch setting" },
      { status: 500 }
    );
  }
}
