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
        { error: "Only administrators can access platform settings" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "";

    const where: any = {};
    if (category && category !== "all") {
      where.category = category;
    }

    const settings = await prisma.platformSettings.findMany({
      where,
      orderBy: [{ category: "asc" }, { key: "asc" }],
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

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error fetching platform settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch platform settings" },
      { status: 500 }
    );
  }
}
