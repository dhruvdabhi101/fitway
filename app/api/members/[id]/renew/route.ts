import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { planId, amountPaid, paymentMode, startDate } = body;

    const member = await prisma.member.findFirst({
      where: { id, gymOwnerId: session.user.id },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const plan = await prisma.membershipPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const start = startDate ? new Date(startDate) : new Date();
    const endDate = new Date(start);
    endDate.setDate(endDate.getDate() + plan.durationDays);

    const membership = await prisma.membership.create({
      data: {
        memberId: id,
        planId: plan.id,
        startDate: start,
        endDate,
        amountPaid: amountPaid || plan.price,
        paymentStatus: "PAID",
        paymentMode: paymentMode || "CASH",
      },
      include: { plan: true },
    });

    return NextResponse.json({ membership }, { status: 201 });
  } catch (error) {
    console.error("Error renewing membership:", error);
    return NextResponse.json(
      { error: "Failed to renew membership" },
      { status: 500 }
    );
  }
}
