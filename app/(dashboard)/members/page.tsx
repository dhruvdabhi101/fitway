"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { AddMemberForm } from "@/components/members/add-member-form";
import { Plus, Search, Users, Phone } from "lucide-react";
import { getMembershipStatus, formatDate } from "@/lib/utils";

interface Member {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  photoUrl: string | null;
  joinDate: string;
  memberships: {
    id: string;
    endDate: string;
    plan: { name: string };
  }[];
}

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const {
    data: members = [],
    isLoading,
  } = useQuery<Member[]>({
    queryKey: ["members", debouncedSearch],
    queryFn: async () => {
      const res = await fetch(
        `/api/members?search=${encodeURIComponent(debouncedSearch)}`
      );
      const data = await res.json();
      return data.members || [];
    },
  });

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["members"] });
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Members</h1>
          <p className="text-slate-500 mt-1">Manage your gym members</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-slate-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : members.length === 0 ? (
        <Card>
          <EmptyState
            icon={Users}
            title={search ? "No members found" : "No members yet"}
            description={
              search
                ? "Try a different search term"
                : "Add your first gym member to get started"
            }
            action={
              !search
                ? {
                    label: "Add Member",
                    onClick: () => setIsAddModalOpen(true),
                  }
                : undefined
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {members.map((member) => {
            const currentMembership = member.memberships[0];
            const status = currentMembership
              ? getMembershipStatus(currentMembership.endDate)
              : null;

            return (
              <Link key={member.id} href={`/members/${member.id}`}>
                <Card className="p-4 hover:border-emerald-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                      {member.photoUrl ? (
                        <img
                          src={member.photoUrl}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-slate-600 font-semibold text-lg">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {member.name}
                        </h3>
                        {status && (
                          <Badge
                            variant={
                              status.status === "active"
                                ? "success"
                                : status.status === "expiring"
                                ? "warning"
                                : "danger"
                            }
                            className="hidden sm:inline-flex"
                          >
                            {status.label}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
                        <Phone className="w-3.5 h-3.5" />
                        {member.phone}
                      </div>
                      {currentMembership && (
                        <p className="text-sm text-slate-500 mt-1">
                          {currentMembership.plan.name} • Expires{" "}
                          {formatDate(currentMembership.endDate)}
                        </p>
                      )}
                    </div>
                    {status && (
                      <Badge
                        variant={
                          status.status === "active"
                            ? "success"
                            : status.status === "expiring"
                            ? "warning"
                            : "danger"
                        }
                        className="sm:hidden shrink-0"
                      >
                        {status.label}
                      </Badge>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Member"
        size="lg"
      >
        <AddMemberForm onSuccess={handleAddSuccess} onCancel={() => setIsAddModalOpen(false)} />
      </Modal>
    </div>
  );
}
