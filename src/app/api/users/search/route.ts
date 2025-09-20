import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Search for users to message
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        users: [],
        message: "Please enter at least 2 characters to search",
      });
    }

    // Search users by name or email, excluding current user
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: session.user.id,
            },
          },
          {
            OR: [
              {
                name: {
                  contains: query,
                },
              },
              {
                email: {
                  contains: query,
                },
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      take: limit,
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      users,
      total: users.length,
    });
  } catch (error) {
    console.error("User search error:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}
