import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Investment status update validation schema
const statusUpdateSchema = z.object({
  status: z.enum(["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"]),
  note: z.string().optional(),
});

interface RouteContext {
  params: {
    id: string;
  };
}

// Get specific investment details
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const investmentId = context.params.id;

    const investment = await prisma.investment.findUnique({
      where: { id: investmentId },
      include: {
        investor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        business: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        returns: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!investment) {
      return NextResponse.json(
        { error: "Investment not found" },
        { status: 404 }
      );
    }

    // Check authorization - user must be the investor, business owner, or admin
    const isAuthorized =
      session.user.id === investment.investorId ||
      session.user.id === investment.business.ownerId ||
      session.user.role === "ADMINISTRATOR";

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Not authorized to view this investment" },
        { status: 403 }
      );
    }

    // Calculate investment performance
    const totalReturns = investment.returns.reduce(
      (sum, ret) => sum + ret.amount,
      0
    );
    const currentValue = investment.amount + totalReturns;
    const roi =
      investment.amount > 0 ? (totalReturns / investment.amount) * 100 : 0;

    return NextResponse.json({
      investment: {
        ...investment,
        performance: {
          totalReturns,
          currentValue,
          roi,
          returnCount: investment.returns.length,
        },
      },
    });
  } catch (error) {
    console.error("Get investment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update investment status (for business owners and admins)
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const investmentId = context.params.id;
    const body = await request.json();
    const validatedData = statusUpdateSchema.parse(body);

    const investment = await prisma.investment.findUnique({
      where: { id: investmentId },
      include: {
        business: {
          include: {
            owner: true,
          },
        },
        investor: true,
      },
    });

    if (!investment) {
      return NextResponse.json(
        { error: "Investment not found" },
        { status: 404 }
      );
    }

    // Check authorization - only business owner or admin can update status
    const isAuthorized =
      session.user.id === investment.business.ownerId ||
      session.user.role === "ADMINISTRATOR";

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Not authorized to update this investment" },
        { status: 403 }
      );
    }

    // Update investment status
    const updatedInvestment = await prisma.investment.update({
      where: { id: investmentId },
      data: {
        status: validatedData.status,
        updatedAt: new Date(),
      },
      include: {
        business: {
          select: {
            title: true,
          },
        },
        investor: {
          select: {
            name: true,
          },
        },
      },
    });

    // Create notification for investor
    const statusMessages = {
      PENDING: "Your investment is pending review",
      ACTIVE: "Your investment has been approved and is now active",
      COMPLETED: "Your investment has been completed",
      CANCELLED: "Your investment has been cancelled",
    };

    await prisma.notification.create({
      data: {
        title: "Investment Status Updated",
        content: `${statusMessages[validatedData.status]} for ${
          investment.business.title
        }${validatedData.note ? `. Note: ${validatedData.note}` : ""}`,
        userId: investment.investorId,
      },
    });

    return NextResponse.json({
      message: "Investment status updated successfully",
      investment: updatedInvestment,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Update investment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Cancel investment (for investors, before approval)
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const investmentId = context.params.id;

    const investment = await prisma.investment.findUnique({
      where: { id: investmentId },
      include: {
        business: true,
      },
    });

    if (!investment) {
      return NextResponse.json(
        { error: "Investment not found" },
        { status: 404 }
      );
    }

    // Check authorization - only investor can cancel their own investment
    if (session.user.id !== investment.investorId) {
      return NextResponse.json(
        { error: "Not authorized to cancel this investment" },
        { status: 403 }
      );
    }

    // Can only cancel pending investments
    if (investment.status !== "PENDING") {
      return NextResponse.json(
        { error: "Can only cancel pending investments" },
        { status: 400 }
      );
    }

    // Update investment status to cancelled
    const cancelledInvestment = await prisma.investment.update({
      where: { id: investmentId },
      data: {
        status: "CANCELLED",
        updatedAt: new Date(),
      },
    });

    // Reduce the business currentRaised amount
    await prisma.business.update({
      where: { id: investment.businessId },
      data: {
        currentRaised: {
          decrement: investment.amount,
        },
      },
    });

    // Create notification for business owner
    await prisma.notification.create({
      data: {
        title: "Investment Cancelled",
        content: `An investment of ₦${investment.amount.toLocaleString()} in ${
          investment.business.title
        } has been cancelled by the investor`,
        userId: investment.business.ownerId,
      },
    });

    return NextResponse.json({
      message: "Investment cancelled successfully",
      investment: cancelledInvestment,
    });
  } catch (error) {
    console.error("Cancel investment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
