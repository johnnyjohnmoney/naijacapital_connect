import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Default platform settings
const defaultSettings = [
  {
    key: "platform.commission_rate",
    value: "5.0",
    dataType: "NUMBER",
    category: "COMMISSION",
    description: "Platform commission percentage on investments",
  },
  {
    key: "platform.withdrawal_fee",
    value: "100",
    dataType: "NUMBER",
    category: "COMMISSION",
    description: "Fixed withdrawal processing fee (NGN)",
  },
  {
    key: "investment.minimum_amount",
    value: "10000",
    dataType: "NUMBER",
    category: "LIMITS",
    description: "Minimum investment amount (NGN)",
  },
  {
    key: "investment.maximum_amount",
    value: "50000000",
    dataType: "NUMBER",
    category: "LIMITS",
    description: "Maximum investment amount per transaction (NGN)",
  },
  {
    key: "withdrawal.minimum_amount",
    value: "5000",
    dataType: "NUMBER",
    category: "LIMITS",
    description: "Minimum withdrawal amount (NGN)",
  },
  {
    key: "withdrawal.auto_approve_threshold",
    value: "100000",
    dataType: "NUMBER",
    category: "LIMITS",
    description: "Withdrawal amounts below this are auto-approved (NGN)",
  },
  {
    key: "features.email_notifications",
    value: "true",
    dataType: "BOOLEAN",
    category: "FEATURES",
    description: "Enable email notifications system-wide",
  },
  {
    key: "features.user_registration",
    value: "true",
    dataType: "BOOLEAN",
    category: "FEATURES",
    description: "Allow new user registrations",
  },
  {
    key: "features.opportunity_creation",
    value: "true",
    dataType: "BOOLEAN",
    category: "FEATURES",
    description: "Allow business owners to create opportunities",
  },
  {
    key: "features.maintenance_mode",
    value: "false",
    dataType: "BOOLEAN",
    category: "FEATURES",
    description: "Enable maintenance mode (blocks non-admin access)",
  },
  {
    key: "business.max_opportunities_per_user",
    value: "10",
    dataType: "NUMBER",
    category: "LIMITS",
    description: "Maximum opportunities per business owner",
  },
  {
    key: "business.review_timeout_days",
    value: "7",
    dataType: "NUMBER",
    category: "INVESTMENT",
    description: "Days before pending opportunity review times out",
  },
];

export async function POST(request: NextRequest) {
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
        { error: "Only administrators can initialize settings" },
        { status: 403 }
      );
    }

    const existingCount = await prisma.platformSettings.count();
    if (existingCount > 0) {
      return NextResponse.json(
        {
          error:
            "Settings already initialized. Use update endpoints to modify.",
        },
        { status: 400 }
      );
    }

    const createdSettings = await Promise.all(
      defaultSettings.map((setting) =>
        prisma.platformSettings.create({
          data: {
            ...setting,
            updatedBy: session.user.id!,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: `Initialized ${createdSettings.length} platform settings`,
      count: createdSettings.length,
    });
  } catch (error) {
    console.error("Error initializing settings:", error);
    return NextResponse.json(
      { error: "Failed to initialize settings" },
      { status: 500 }
    );
  }
}
