const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function testConnection() {
  try {
    const userCount = await prisma.user.count();
    const businessCount = await prisma.business.count();
    const investmentCount = await prisma.investment.count();

    console.log("✅ Successfully connected to Supabase!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Database Statistics:");
    console.log(`  Users: ${userCount}`);
    console.log(`  Businesses: ${businessCount}`);
    console.log(`  Investments: ${investmentCount}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Check if admin exists
    const admin = await prisma.user.findFirst({
      where: { role: "ADMINISTRATOR" },
    });

    if (admin) {
      console.log("✅ Admin account found:", admin.email);
    } else {
      console.log("⚠️  No admin account found");
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    process.exit(1);
  }
}

testConnection();
