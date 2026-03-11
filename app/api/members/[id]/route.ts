import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ member });
  } catch (error) {
    console.error("Error fetching member:", error);
    return NextResponse.json(
      { error: "Failed to fetch member" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, phone, email, address, notes, photoUrl } = body;

    const existingMember = await prisma.member.findFirst({
      where: { id, gymOwnerId: session.user.id },
    });

    if (!existingMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
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
    });

    return NextResponse.json({ member });
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json(
      { error: "Failed to update member" },
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

    const existingMember = await prisma.member.findFirst({
      where: { id, gymOwnerId: session.user.id },
    });

    if (!existingMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    await prisma.member.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting member:", error);
    return NextResponse.json(
      { error: "Failed to delete member" },
      { status: 500 }
    );
  }
}
