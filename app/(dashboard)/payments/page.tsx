"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { RenewMembershipForm } from "@/components/members/renew-membership-form";
import { Phone, RefreshCw, CheckCircle } from "lucide-react";
import { formatDate, getMembershipStatus } from "@/lib/utils";
import { usePaymentsDue } from "@src/queries/payment.queries";
import type { PaymentFilter } from "@src/api/query-client";

export default function PaymentsPage() {
  const [filter, setFilter] = useState<PaymentFilter>("all");
  const [renewingMemberId, setRenewingMemberId] = useState<string | null>(null);

  const { data: memberships = [], isLoading } = usePaymentsDue(filter);

  const filters: { label: string; value: PaymentFilter }[] = [
    { label: "All Due", value: "all" },
    { label: "Overdue", value: "overdue" },
    { label: "Expiring Soon", value: "expiring" },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payments Due</h1>
        <p className="text-slate-500 mt-1">Members with expired or expiring memberships</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              filter === f.value
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : memberships.length === 0 ? (
        <Card>
          <EmptyState
            icon={CheckCircle}
            title="All caught up!"
            description={
              filter === "all"
                ? "No members with due or expiring memberships"
                : filter === "overdue"
                ? "No overdue memberships"
                : "No memberships expiring soon"
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {memberships.map((membership) => {
            const status = getMembershipStatus(membership.endDate);
            const isOverdue = status.status === "expired";

            return (
              <Card
                key={membership.id}
                className={`p-4 border-l-4 ${isOverdue ? "border-l-red-500" : "border-l-amber-500"}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Link
                    href={`/members/${membership.member.id}`}
                    className="flex items-center gap-4 flex-1 min-w-0"
                  >
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                      {membership.member.photoUrl ? (
                        <img
                          src={membership.member.photoUrl}
                          alt={membership.member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-slate-600 font-semibold text-lg">
                          {membership.member.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {membership.member.name}
                        </h3>
                        <Badge variant={isOverdue ? "danger" : "warning"}>
                          {isOverdue
                            ? `${Math.abs(status.daysLeft)} days overdue`
                            : `${status.daysLeft} days left`}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
                        <Phone className="w-3.5 h-3.5" />
                        {membership.member.phone}
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        {membership.plan.name} - Expired {formatDate(membership.endDate)}
                      </p>
                    </div>
                  </Link>
                  <Button
                    size="sm"
                    onClick={() => setRenewingMemberId(membership.member.id)}
                    className="flex-shrink-0"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Renew
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={!!renewingMemberId}
        onClose={() => setRenewingMemberId(null)}
        title="Renew Membership"
        size="md"
      >
        {renewingMemberId && (
          <RenewMembershipForm
            memberId={renewingMemberId}
            onSuccess={() => setRenewingMemberId(null)}
            onCancel={() => setRenewingMemberId(null)}
          />
        )}
      </Modal>
    </div>
  );
}
