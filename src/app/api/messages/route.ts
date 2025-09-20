import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Message creation validation schema
const messageSchema = z.object({
  receiverId: z.string().min(1, "Receiver ID is required"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject is too long"),
  content: z
    .string()
    .min(1, "Message content is required")
    .max(2000, "Message is too long"),
});

// Get messages for the authenticated user
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
    const type = searchParams.get("type") || "received"; // received or sent
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Build where clause based on message type
    const where =
      type === "sent"
        ? { senderId: session.user.id }
        : { receiverId: session.user.id };

    // Get messages with pagination
    const messages = await prisma.message.findMany({
      where,
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
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const total = await prisma.message.count({ where });

    // Mark received messages as read when viewing them
    if (type === "received") {
      await prisma.message.updateMany({
        where: {
          receiverId: session.user.id,
          status: "UNREAD",
        },
        data: {
          status: "READ",
        },
      });
    }

    return NextResponse.json({
      messages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// Send a new message
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = messageSchema.parse(body);

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: validatedData.receiverId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!receiver) {
      return NextResponse.json(
        { error: "Receiver not found" },
        { status: 404 }
      );
    }

    // Prevent users from sending messages to themselves
    if (validatedData.receiverId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot send message to yourself" },
        { status: 400 }
      );
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content: validatedData.content,
        subject: validatedData.subject,
        senderId: session.user.id,
        receiverId: validatedData.receiverId,
        status: "UNREAD",
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
    });

    // Create notification for the receiver
    await prisma.notification.create({
      data: {
        title: "New Message Received",
        content: `You have received a new message from ${session.user.name}: ${validatedData.subject}`,
        userId: validatedData.receiverId,
      },
    });

    return NextResponse.json(
      {
        message: "Message sent successfully",
        data: message,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Message sending error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
