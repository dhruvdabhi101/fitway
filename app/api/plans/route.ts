import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plans = await prisma.membershipPlan.findMany({
      where: { gymOwnerId: session.user.id, isActive: true },
      orderBy: { price: "asc" },
    });

    return NextResponse.json({ plans });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, durationDays, price } = body;

    if (!name || !durationDays || !price) {
      return NextResponse.json(
        { error: "Name, duration, and price are required" },
        { status: 400 }
      );
    }

    const plan = await prisma.membershipPlan.create({
      data: {
        gymOwnerId: session.user.id,
        name,
        durationDays: parseInt(durationDays),
        price: parseFloat(price),
      },
    });

    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json(
      { error: "Failed to create plan" },
      { status: 500 }
    );
  }
}
