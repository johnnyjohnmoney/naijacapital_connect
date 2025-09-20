#!/usr/bin/env node

/**
 * NaijaConnect Capital - Admin Account Creation Script
 *
 * This script allows secure creation of administrator accounts
 * Run this script from the project root directory
 *
 * Usage: node scripts/create-admin.js
 */

import readline from "readline";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function questionHidden(prompt) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    stdin.resume();
    stdin.setEncoding("utf8");
    stdin.setRawMode(true);

    process.stdout.write(prompt);

    let password = "";

    stdin.on("data", function (char) {
      char = char + "";

      switch (char) {
        case "\n":
        case "\r":
        case "\u0004":
          stdin.setRawMode(false);
          stdin.pause();
          resolve(password);
          break;
        case "\u0003":
          process.exit();
          break;
        case "\u007f": // Backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write("\b \b");
          }
          break;
        default:
          password += char;
          process.stdout.write("*");
          break;
      }
    });
  });
}

async function createAdmin() {
  try {
    console.log("\n🔐 NaijaConnect Capital - Admin Account Creation");
    console.log("================================================\n");

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMINISTRATOR" },
    });

    if (existingAdmin) {
      console.log("⚠️  An administrator account already exists:");
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.name}\n`);

      const overwrite = await question(
        "Do you want to create an additional admin? (y/N): "
      );
      if (
        overwrite.toLowerCase() !== "y" &&
        overwrite.toLowerCase() !== "yes"
      ) {
        console.log("Admin creation cancelled.");
        return;
      }
    }

    // Get admin details
    const name = await question("Enter admin full name: ");
    if (!name || name.trim().length < 2) {
      throw new Error("Name must be at least 2 characters long");
    }

    const email = await question("Enter admin email: ");
    if (!email || !email.includes("@")) {
      throw new Error("Please enter a valid email address");
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim() },
    });

    if (existingUser) {
      throw new Error("A user with this email already exists");
    }

    const password = await questionHidden(
      "Enter admin password (min 8 characters): "
    );
    console.log(""); // New line after hidden input

    if (!password || password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    const confirmPassword = await questionHidden("Confirm password: ");
    console.log(""); // New line after hidden input

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Hash password
    console.log("\nCreating admin account...");
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
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

    console.log("\n✅ Administrator account created successfully!");
    console.log("==============================================");
    console.log(`ID: ${adminUser.id}`);
    console.log(`Name: ${adminUser.name}`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`Role: ${adminUser.role}`);
    console.log(`Created: ${adminUser.createdAt.toLocaleString()}\n`);

    console.log("🔑 You can now login at: http://localhost:3000/auth/signin");
    console.log(
      "📱 Access admin dashboard at: http://localhost:3000/dashboard\n"
    );
  } catch (error) {
    console.error("\n❌ Error creating admin account:", error.message);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

async function main() {
  try {
    await createAdmin();
  } catch (error) {
    console.error("Script error:", error);
    process.exit(1);
  }
}

// Handle script termination
process.on("SIGINT", async () => {
  console.log("\n\nScript interrupted.");
  rl.close();
  await prisma.$disconnect();
  process.exit(0);
});

main();
