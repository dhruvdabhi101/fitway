import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { successResponse, unauthorizedResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return unauthorizedResponse();
    }

    const plans = await prisma.membershipPlan.findMany({
      where: { gymOwnerId: session.user.id, isActive: true },
      orderBy: { price: "asc" },
    });

    return successResponse(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { data: null, error: { code: "FETCH_ERROR", message: "Failed to fetch plans" } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const { name, durationDays, price } = body;

    if (!name || !durationDays || !price) {
      return NextResponse.json(
        { data: null, error: { code: "VALIDATION_ERROR", message: "Name, duration, and price are required" } },
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

    return successResponse(plan, 201);
  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json(
      { data: null, error: { code: "CREATE_ERROR", message: "Failed to create plan" } },
      { status: 500 }
    );
  }
}
