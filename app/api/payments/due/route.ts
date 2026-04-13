import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { successResponse, unauthorizedResponse } from "@/lib/api-response";
import { Prisma } from "@/app/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return unauthorizedResponse();
    }

    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get("filter") || "all";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const members = await prisma.member.findMany({
      where: { gymOwnerId: session.user.id, isActive: true },
      select: { id: true },
    });

    if (members.length === 0) {
      return successResponse([]);
    }

    const memberIds = members.map((m) => m.id);

    const latestMemberships = await prisma.$queryRaw<
      Array<{
        id: string;
        memberId: string;
        planId: string;
        startDate: Date;
        endDate: Date;
        amountPaid: number;
        paymentStatus: string;
        paymentMode: string;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
      }>
    >(
      Prisma.sql`SELECT DISTINCT ON (m."memberId") 
        m.*
      FROM "memberships" m
      WHERE m."memberId" IN (${Prisma.join(memberIds)})
      ORDER BY m."memberId", m."endDate" DESC`
    );

    let filteredMemberships = latestMemberships;

    if (filter === "overdue") {
      filteredMemberships = latestMemberships.filter((m) => m.endDate < today);
    } else if (filter === "expiring") {
      filteredMemberships = latestMemberships.filter(
        (m) => m.endDate >= today && m.endDate <= sevenDaysFromNow
      );
    } else {
      filteredMemberships = latestMemberships.filter((m) => m.endDate <= sevenDaysFromNow);
    }

    const memberships = await prisma.membership.findMany({
      where: {
        id: { in: filteredMemberships.map((m) => m.id) },
      },
      include: {
        member: true,
        plan: true,
      },
      orderBy: { endDate: "asc" },
    });

    return successResponse(memberships);
  } catch (error) {
    console.error("Error fetching due payments:", error);
    return NextResponse.json(
      { data: null, error: { code: "FETCH_ERROR", message: "Failed to fetch due payments" } },
      { status: 500 }
    );
  }
}
