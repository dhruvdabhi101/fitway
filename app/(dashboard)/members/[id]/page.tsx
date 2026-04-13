"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { EditMemberForm } from "@/components/members/edit-member-form";
import { RenewMembershipForm } from "@/components/members/renew-membership-form";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Edit,
  RefreshCw,
  Trash2,
  FileText,
} from "lucide-react";
import { formatDate, formatCurrency, getMembershipStatus } from "@/lib/utils";
import posthog from "posthog-js";
import { useMember, useDeleteMember } from "@src/queries/member.queries";
import type { MemberWithMemberships } from "@src/api/types";

export default function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);

  const { data: member, isLoading } = useMember(id);
  const deleteMember = useDeleteMember();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    deleteMember.mutate(id, {
      onSuccess: () => {
        posthog.capture("member_deleted", { member_id: id });
        router.push("/members");
      },
    });
  };

  if (isLoading || !member) {
    return (
      <div className="p-4 lg:p-8">
        <div className="h-8 w-32 bg-slate-200 rounded-lg animate-pulse mb-6" />
        <div className="h-48 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const currentMembership = (member as MemberWithMemberships).memberships[0];
  const status = currentMembership ? getMembershipStatus(currentMembership.endDate) : null;

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/members" className="p-2 -ml-2 rounded-xl hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Member Profile</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
              {member.photoUrl ? (
                <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-slate-600 font-bold text-3xl">
                  {member.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h2 className="text-xl font-bold text-slate-900">{member.name}</h2>
                {status && (
                  <Badge
                    variant={
                      status.status === "active" ? "success" : status.status === "expiring" ? "warning" : "danger"
                    }
                  >
                    {status.label}
                  </Badge>
                )}
              </div>

              <div className="space-y-1.5 text-slate-600">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{member.phone}</span>
                </div>
                {member.email && (
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{member.email}</span>
                  </div>
                )}
                {member.address && (
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{member.address}</span>
                  </div>
                )}
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(member.joinDate)}</span>
                </div>
              </div>

              {member.notes && (
                <div className="mt-4 p-3 bg-slate-50 rounded-xl flex items-start gap-2">
                  <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                  <p className="text-sm text-slate-600">{member.notes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-100">
            <Button variant="primary" onClick={() => setIsRenewModalOpen(true)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Renew Membership
            </Button>
            <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={deleteMember.isPending}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {currentMembership && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-slate-900">Current Membership</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-slate-500">Plan</p>
                <p className="font-medium text-slate-900">{currentMembership.plan.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Start Date</p>
                <p className="font-medium text-slate-900">{formatDate(currentMembership.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">End Date</p>
                <p className="font-medium text-slate-900">{formatDate(currentMembership.endDate)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Amount Paid</p>
                <p className="font-medium text-slate-900">{formatCurrency(currentMembership.amountPaid)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-slate-900">Membership History</h3>
        </CardHeader>
        <CardContent className="p-0">
          {(member as MemberWithMemberships).memberships.length === 0 ? (
            <div className="p-5 text-center text-slate-500">No membership history</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {(member as MemberWithMemberships).memberships.map((membership) => (
                <div key={membership.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-900">{membership.plan.name}</p>
                    <p className="text-sm text-slate-500">
                      {formatDate(membership.startDate)} - {formatDate(membership.endDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="default">{membership.paymentMode}</Badge>
                    <span className="font-medium text-slate-900">{formatCurrency(membership.amountPaid)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Member" size="lg">
        <EditMemberForm
          member={member as MemberWithMemberships}
          onSuccess={() => setIsEditModalOpen(false)}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      <Modal isOpen={isRenewModalOpen} onClose={() => setIsRenewModalOpen(false)} title="Renew Membership" size="md">
        <RenewMembershipForm
          memberId={member.id}
          onSuccess={() => setIsRenewModalOpen(false)}
          onCancel={() => setIsRenewModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
