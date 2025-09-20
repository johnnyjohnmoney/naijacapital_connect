import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const adminCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  adminSecretKey: z.string().min(1, "Admin secret key is required"),
});

// This should be set as an environment variable in production
const ADMIN_SECRET_KEY =
  process.env.ADMIN_SECRET_KEY || "your-super-secret-admin-key-change-this";

export async function POST(request: NextRequest) {
  try {
    console.log("Admin creation endpoint called");
    const body = await request.json();
    console.log("Request body:", JSON.stringify(body, null, 2));

    const validatedData = adminCreateSchema.parse(body);
    console.log("Validation passed");

    // Verify admin secret key
    if (validatedData.adminSecretKey !== ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: "Invalid admin secret key" },
        { status: 403 }
      );
    }

    // Check if an admin already exists (optional: limit to one admin)
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMINISTRATOR" },
    });

    if (existingAdmin) {
      return NextResponse.json(
        {
          error:
            "An administrator account already exists. Use the update endpoint to modify.",
        },
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: "ADMINISTRATOR",
        verified: true, // Auto-verify admin accounts
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Administrator account created successfully",
        admin: adminUser,
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

    console.error("Admin creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Optional: Allow existing admins to create new admins
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session || session.user?.role !== "ADMINISTRATOR") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const createSchema = z.object({
      name: z.string().min(2, "Name must be at least 2 characters"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
    });

    const validatedData = createSchema.parse(body);

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: "ADMINISTRATOR",
        verified: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Administrator account created successfully by existing admin",
        admin: adminUser,
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

    console.error("Admin creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
