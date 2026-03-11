import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where = {
      gymOwnerId: session.user.id,
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { phone: { contains: search } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          memberships: {
            orderBy: { createdAt: "desc" },
            take: 1,
            include: { plan: true },
          },
        },
      }),
      prisma.member.count({ where }),
    ]);

    return NextResponse.json({
      members,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
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
    const { name, phone, email, address, notes, photoUrl, joinDate, planId, amountPaid, paymentMode } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    const member = await prisma.member.create({
      data: {
        gymOwnerId: session.user.id,
        name,
        phone,
        email: email || null,
        address: address || null,
        notes: notes || null,
        photoUrl: photoUrl || null,
        joinDate: joinDate ? new Date(joinDate) : new Date(),
      },
    });

    if (planId) {
      const plan = await prisma.membershipPlan.findUnique({
        where: { id: planId },
      });

      if (plan) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.durationDays);

        await prisma.membership.create({
          data: {
            memberId: member.id,
            planId: plan.id,
            startDate,
            endDate,
            amountPaid: amountPaid || plan.price,
            paymentStatus: "PAID",
            paymentMode: paymentMode || "CASH",
          },
        });
      }
    }

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json(
      { error: "Failed to create member" },
      { status: 500 }
    );
  }
}
