import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { successResponse, unauthorizedResponse, notFoundResponse } from "@/lib/api-response";

export async function PUT(
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
    const { name, durationDays, price } = body;

    const existingPlan = await prisma.membershipPlan.findFirst({
      where: { id, gymOwnerId: session.user.id },
    });

    if (!existingPlan) {
      return notFoundResponse("Plan not found");
    }

    const plan = await prisma.membershipPlan.update({
      where: { id },
      data: {
        name,
        durationDays: parseInt(durationDays),
        price: parseFloat(price),
      },
    });

    return successResponse(plan);
  } catch (error) {
    console.error("Error updating plan:", error);
    return NextResponse.json(
      { data: null, error: { code: "UPDATE_ERROR", message: "Failed to update plan" } },
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
      return unauthorizedResponse();
    }

    const { id } = await params;

    const existingPlan = await prisma.membershipPlan.findFirst({
      where: { id, gymOwnerId: session.user.id },
    });

    if (!existingPlan) {
      return notFoundResponse("Plan not found");
    }

    await prisma.membershipPlan.update({
      where: { id },
      data: { isActive: false },
    });

    return successResponse({ success: true });
  } catch (error) {
    console.error("Error deleting plan:", error);
    return NextResponse.json(
      { data: null, error: { code: "DELETE_ERROR", message: "Failed to delete plan" } },
      { status: 500 }
    );
  }
}
