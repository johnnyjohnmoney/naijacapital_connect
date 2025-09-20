import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: {
    userId: string;
  };
}

// Get conversation between current user and another user
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { userId } = context.params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // Verify the other user exists
    const otherUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!otherUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get conversation messages between current user and the specified user
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: session.user.id,
            receiverId: userId,
          },
          {
            senderId: userId,
            receiverId: session.user.id,
          },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc", // Chronological order for conversation view
      },
      skip,
      take: limit,
    });

    // Mark messages as read when viewing conversation
    await prisma.message.updateMany({
      where: {
        senderId: userId,
        receiverId: session.user.id,
        status: "UNREAD",
      },
      data: {
        status: "READ",
      },
    });

    // Get total count
    const total = await prisma.message.count({
      where: {
        OR: [
          {
            senderId: session.user.id,
            receiverId: userId,
          },
          {
            senderId: userId,
            receiverId: session.user.id,
          },
        ],
      },
    });

    return NextResponse.json({
      messages,
      otherUser,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 500 }
    );
  }
}
