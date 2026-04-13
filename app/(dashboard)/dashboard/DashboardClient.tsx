"use client";

import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, AlertCircle, Clock } from "lucide-react";
import { formatDate, getMembershipStatus } from "@/lib/utils";
import { StatCard } from "@/components/ui/stat-card";
import type { DashboardStats, MemberWithMemberships, MembershipWithDetails } from "./types";

interface DashboardClientProps {
  stats: DashboardStats;
  recentMembers: MemberWithMemberships[];
  upcomingExpiries: MembershipWithDetails[];
}

export function DashboardClient({ stats, recentMembers, upcomingExpiries }: DashboardClientProps) {
  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back! Here&apos;s your gym overview.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Members" value={stats.totalMembers} icon={Users} variant="default" />
        <StatCard title="Active" value={stats.activeMemberships} icon={UserCheck} variant="success" />
        <StatCard title="Expiring Soon" value={stats.expiringSoon} icon={Clock} variant="warning" />
        <StatCard title="Overdue" value={stats.overduePayments} icon={AlertCircle} variant="danger" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Expiring Soon</h2>
            <Link href="/payments" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {upcomingExpiries.length === 0 ? (
              <div className="p-5 text-center text-slate-500">No memberships expiring soon</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {upcomingExpiries.map((membership) => {
                  const status = getMembershipStatus(membership.endDate);
                  return (
                    <Link
                      key={membership.id}
                      href={`/members/${membership.memberId}`}
                      className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                          <span className="text-amber-700 font-semibold text-sm">
                            {membership.member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{membership.member.name}</p>
                          <p className="text-sm text-slate-500">{membership.plan.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="warning">{status.daysLeft} days left</Badge>
                        <p className="text-xs text-slate-500 mt-1">{formatDate(membership.endDate)}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Members</h2>
            <Link href="/members" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentMembers.length === 0 ? (
              <div className="p-5 text-center text-slate-500">No members yet. Add your first member!</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentMembers.map((member) => {
                  const currentMembership = (member as MemberWithMemberships).memberships[0];
                  const status = currentMembership ? getMembershipStatus(currentMembership.endDate) : null;

                  return (
                    <Link
                      key={member.id}
                      href={`/members/${member.id}`}
                      className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                          {member.photoUrl ? (
                            <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-slate-600 font-semibold text-sm">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{member.name}</p>
                          <p className="text-sm text-slate-500">{member.phone}</p>
                        </div>
                      </div>
                      {status && (
                        <Badge
                          variant={status.status === "active" ? "success" : status.status === "expiring" ? "warning" : "danger"}
                        >
                          {status.label}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
