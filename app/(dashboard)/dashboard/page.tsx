import { auth } from "@/lib/auth";
import { getDashboardStats, getRecentMembers, getUpcomingExpiries } from "@src/services/dashboard.service";
import { DashboardClient } from "./DashboardClient";
import type { DashboardStats, MemberWithMemberships, MembershipWithDetails } from "./types";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) return null;

  const [stats, recentMembers, upcomingExpiries] = await Promise.all([
    getDashboardStats(session.user.id),
    getRecentMembers(session.user.id),
    getUpcomingExpiries(session.user.id),
  ]);

  return (
    <DashboardClient
      stats={stats as DashboardStats}
      recentMembers={recentMembers as MemberWithMemberships[]}
      upcomingExpiries={upcomingExpiries as MembershipWithDetails[]}
    />
  );
}
