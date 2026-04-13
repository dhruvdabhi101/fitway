import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { successResponse, unauthorizedResponse, notFoundResponse } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    const member = await prisma.member.findFirst({
      where: { id, gymOwnerId: session.user.id },
      include: {
        memberships: {
          orderBy: { createdAt: "desc" },
          include: { plan: true },
        },
      },
    });

    if (!member) {
      return notFoundResponse("Member not found");
    }

    return successResponse(member);
  } catch (error) {
    console.error("Error fetching member:", error);
    return NextResponse.json(
      { data: null, error: { code: "FETCH_ERROR", message: "Failed to fetch member" } },
      { status: 500 }
    );
  }
}

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
    const { name, phone, email, address, notes, photoUrl } = body;

    const existingMember = await prisma.member.findFirst({
      where: { id, gymOwnerId: session.user.id },
    });

    if (!existingMember) {
      return notFoundResponse("Member not found");
    }

    const member = await prisma.member.update({
      where: { id },
      data: {
        name,
        phone,
        email: email || null,
        address: address || null,
        notes: notes || null,
        photoUrl: photoUrl || null,
      },
      include: {
        memberships: {
          orderBy: { createdAt: "desc" },
          include: { plan: true },
        },
      },
    });

    return successResponse(member);
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json(
      { data: null, error: { code: "UPDATE_ERROR", message: "Failed to update member" } },
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

    const existingMember = await prisma.member.findFirst({
      where: { id, gymOwnerId: session.user.id },
    });

    if (!existingMember) {
      return notFoundResponse("Member not found");
    }

    await prisma.member.update({
      where: { id },
      data: { isActive: false },
    });

    return successResponse({ success: true });
  } catch (error) {
    console.error("Error deleting member:", error);
    return NextResponse.json(
      { data: null, error: { code: "DELETE_ERROR", message: "Failed to delete member" } },
      { status: 500 }
    );
  }
}
