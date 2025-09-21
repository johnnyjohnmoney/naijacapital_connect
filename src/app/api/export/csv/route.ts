import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, options } = await request.json();
    const actualUserId = userId || session.user.id;

    // Fetch user's investment data from database
    const user = await prisma.user.findUnique({
      where: { id: actualUserId },
      include: {
        investments: {
          include: {
            business: true,
            returns: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate CSV content
    const csvRows: string[] = [];

    // Header
    csvRows.push("NAIJACONNECT CAPITAL - PORTFOLIO EXPORT");
    csvRows.push(`Generated on: ${new Date().toLocaleString()}`);
    csvRows.push(`User: ${user.name} (${user.email})`);
    csvRows.push(""); // Empty row

    // Portfolio Holdings
    csvRows.push("PORTFOLIO HOLDINGS");
    csvRows.push(
      "Business Name,Sector,Investment Amount,Investment Date,Status"
    );

    user.investments.forEach((investment: any) => {
      const businessName = investment.business?.title || "Unknown Business";
      const sector = investment.business?.industry || "Unknown Sector";
      const amount = investment.amount;
      const date = investment.createdAt.toISOString().split("T")[0];
      const status = investment.status;

      csvRows.push(
        `"${businessName}","${sector}",${amount},"${date}","${status}"`
      );
    });

    // Calculate totals
    const totalInvested = user.investments.reduce(
      (sum: number, inv: any) => sum + inv.amount,
      0
    );
    const activeInvestments = user.investments.filter(
      (inv: any) => inv.status === "ACTIVE"
    ).length;

    csvRows.push(""); // Empty row
    csvRows.push("PORTFOLIO SUMMARY");
    csvRows.push("Metric,Value");
    csvRows.push(`Total Invested,${totalInvested}`);
    csvRows.push(`Active Investments,${activeInvestments}`);
    csvRows.push(`Total Investments,${user.investments.length}`);

    const csvContent = csvRows.join("\n");

    // Return CSV content
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="portfolio-export-${
          new Date().toISOString().split("T")[0]
        }.csv"`,
      },
    });
  } catch (error) {
    console.error("CSV export error:", error);
    return NextResponse.json(
      { error: "Failed to generate CSV export" },
      { status: 500 }
    );
  }
}
