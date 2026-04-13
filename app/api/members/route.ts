import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { successResponse, unauthorizedResponse, validationErrorResponse } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return unauthorizedResponse();
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

    void total; // meta could be added later

    return successResponse(members, 200);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { data: null, error: { code: "FETCH_ERROR", message: "Failed to fetch members" } },
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
    const { name, phone, email, address, notes, photoUrl, joinDate, planId, amountPaid, paymentMode } = body;

    if (!name || !phone) {
      return validationErrorResponse({ name: !name ? "Name is required" : null, phone: !phone ? "Phone is required" : null });
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

    const memberWithMemberships = await prisma.member.findUnique({
      where: { id: member.id },
      include: {
        memberships: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { plan: true },
        },
      },
    });

    return successResponse(memberWithMemberships, 201);
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json(
      { data: null, error: { code: "CREATE_ERROR", message: "Failed to create member" } },
      { status: 500 }
    );
  }
}
