import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(
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
    const { name, durationDays, price } = body;

    const existingPlan = await prisma.membershipPlan.findFirst({
      where: { id, gymOwnerId: session.user.id },
    });

    if (!existingPlan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const plan = await prisma.membershipPlan.update({
      where: { id },
      data: {
        name,
        durationDays: parseInt(durationDays),
        price: parseFloat(price),
      },
    });

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Error updating plan:", error);
    return NextResponse.json(
      { error: "Failed to update plan" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingPlan = await prisma.membershipPlan.findFirst({
      where: { id, gymOwnerId: session.user.id },
    });

    if (!existingPlan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    await prisma.membershipPlan.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting plan:", error);
    return NextResponse.json(
      { error: "Failed to delete plan" },
      { status: 500 }
    );
  }
}
