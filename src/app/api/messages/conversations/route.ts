import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Get list of conversations (users that the current user has messaged with)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get all unique users that have had conversations with the current user
    const sentMessages = await prisma.message.findMany({
      where: { senderId: session.user.id },
      select: { receiverId: true },
      distinct: ["receiverId"],
    });

    const receivedMessages = await prisma.message.findMany({
      where: { receiverId: session.user.id },
      select: { senderId: true },
      distinct: ["senderId"],
    });

    // Combine and get unique user IDs
    const userIds = new Set([
      ...sentMessages.map((m) => m.receiverId),
      ...receivedMessages.map((m) => m.senderId),
    ]);

    // Get user details and latest message for each conversation
    const conversations = await Promise.all(
      Array.from(userIds).map(async (userId) => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        });

        // Get the latest message in this conversation
        const latestMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: session.user.id, receiverId: userId },
              { senderId: userId, receiverId: session.user.id },
            ],
          },
          orderBy: { createdAt: "desc" },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        // Count unread messages from this user
        const unreadCount = await prisma.message.count({
          where: {
            senderId: userId,
            receiverId: session.user.id,
            status: "UNREAD",
          },
        });

        return {
          user,
          latestMessage,
          unreadCount,
        };
      })
    );

    // Filter out conversations where user doesn't exist and sort by latest message
    const validConversations = conversations
      .filter((conv) => conv.user !== null)
      .sort((a, b) => {
        if (!a.latestMessage) return 1;
        if (!b.latestMessage) return -1;
        return (
          new Date(b.latestMessage.createdAt).getTime() -
          new Date(a.latestMessage.createdAt).getTime()
        );
      });

    return NextResponse.json({
      conversations: validConversations,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
