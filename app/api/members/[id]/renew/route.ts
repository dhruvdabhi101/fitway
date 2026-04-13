import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { successResponse, unauthorizedResponse, notFoundResponse, validationErrorResponse } from "@/lib/api-response";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const body = await request.json();
    const { planId, amountPaid, paymentMode, startDate } = body;

    if (!planId) {
      return validationErrorResponse({ planId: "Plan is required" });
    }

    const member = await prisma.member.findFirst({
      where: { id, gymOwnerId: session.user.id },
    });

    if (!member) {
      return notFoundResponse("Member not found");
    }

    const plan = await prisma.membershipPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return notFoundResponse("Plan not found");
    }

    const start = startDate ? new Date(startDate) : new Date();
    const endDate = new Date(start);
    endDate.setDate(endDate.getDate() + plan.durationDays);

    await prisma.membership.create({
      data: {
        memberId: id,
        planId: plan.id,
        startDate: start,
        endDate,
        amountPaid: amountPaid || plan.price,
        paymentStatus: "PAID",
        paymentMode: paymentMode || "CASH",
      },
    });

    const updatedMember = await prisma.member.findUnique({
      where: { id },
      include: {
        memberships: {
          orderBy: { createdAt: "desc" },
          include: { plan: true },
        },
      },
    });

    return successResponse(updatedMember, 201);
  } catch (error) {
    console.error("Error renewing membership:", error);
    return NextResponse.json(
      { data: null, error: { code: "RENEW_ERROR", message: "Failed to renew membership" } },
      { status: 500 }
    );
  }
}
