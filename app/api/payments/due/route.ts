import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { successResponse, unauthorizedResponse } from "@/lib/api-response";

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

    let where = {};

    if (filter === "overdue") {
      where = {
        member: { gymOwnerId: session.user.id, isActive: true },
        endDate: { lt: today },
      };
    } else if (filter === "expiring") {
      where = {
        member: { gymOwnerId: session.user.id, isActive: true },
        endDate: { gte: today, lte: sevenDaysFromNow },
      };
    } else {
      where = {
        member: { gymOwnerId: session.user.id, isActive: true },
        endDate: { lte: sevenDaysFromNow },
      };
    }

    const memberships = await prisma.membership.findMany({
      where,
      orderBy: { endDate: "asc" },
      include: {
        member: true,
        plan: true,
      },
      distinct: ["memberId"],
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
