import { prisma } from "@/lib/db";

export async function getDashboardStats(gymOwnerId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const [totalMembers, activeMemberships, expiringSoon, overduePayments] =
    await Promise.all([
      prisma.member.count({
        where: { gymOwnerId, isActive: true },
      }),
      prisma.membership.count({
        where: {
          member: { gymOwnerId },
          endDate: { gte: today },
        },
      }),
      prisma.membership.count({
        where: {
          member: { gymOwnerId },
          endDate: {
            gte: today,
            lte: sevenDaysFromNow,
          },
        },
      }),
      prisma.membership.count({
        where: {
          member: { gymOwnerId },
          endDate: { lt: today },
        },
      }),
    ]);

  return { totalMembers, activeMemberships, expiringSoon, overduePayments };
}

export async function getRecentMembers(gymOwnerId: string) {
  return prisma.member.findMany({
    where: { gymOwnerId, isActive: true },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      memberships: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { plan: true },
      },
    },
  });
}

export async function getUpcomingExpiries(gymOwnerId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  return prisma.membership.findMany({
    where: {
      member: { gymOwnerId, isActive: true },
      endDate: {
        gte: today,
        lte: sevenDaysFromNow,
      },
    },
    orderBy: { endDate: "asc" },
    take: 5,
    include: {
      member: true,
      plan: true,
    },
  });
}
