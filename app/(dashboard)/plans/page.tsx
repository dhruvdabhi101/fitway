"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Plus, CreditCard, Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useForm } from "react-hook-form";
import posthog from "posthog-js";
import { usePlans, useCreatePlan, useUpdatePlan, useDeletePlan } from "@src/queries/plan.queries";
import type { MembershipPlan } from "@/app/generated/prisma/client";

export default function PlansPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  const { data: plans = [], isLoading } = usePlans();
  const deletePlan = useDeletePlan();

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    deletePlan.mutate(id, {
      onSuccess: () => posthog.capture("plan_deleted", { plan_id: id }),
    });
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Membership Plans</h1>
          <p className="text-slate-500 mt-1">Create and manage your membership plans</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Plan
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <Card>
          <EmptyState
            icon={CreditCard}
            title="No plans yet"
            description="Create your first membership plan to get started"
            action={{
              label: "Add Plan",
              onClick: () => setIsAddModalOpen(true),
            }}
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingPlan(plan)}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {formatCurrency(plan.price)}
              </p>
              <p className="text-sm text-slate-500 mt-2">{plan.durationDays} days</p>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Plan"
        size="md"
      >
        <PlanForm
          onSuccess={() => setIsAddModalOpen(false)}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingPlan}
        onClose={() => setEditingPlan(null)}
        title="Edit Plan"
        size="md"
      >
        {editingPlan && (
          <PlanForm
            plan={editingPlan}
            onSuccess={() => setEditingPlan(null)}
            onCancel={() => setEditingPlan(null)}
          />
        )}
      </Modal>
    </div>
  );
}

interface PlanFormProps {
  plan?: MembershipPlan;
  onSuccess: () => void;
  onCancel: () => void;
}

function PlanForm({ plan, onSuccess, onCancel }: PlanFormProps) {
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<{
    name: string;
    durationDays: string;
    price: string;
  }>({
    defaultValues: {
      name: plan?.name || "",
      durationDays: plan?.durationDays?.toString() || "30",
      price: plan?.price?.toString() || "",
    },
  });

  const isEditing = !!plan;

  const onSubmit = handleSubmit(async (values) => {
    const data = {
      name: values.name,
      durationDays: parseInt(values.durationDays),
      price: parseFloat(values.price),
    };

    if (isEditing && plan) {
      await updatePlan.mutateAsync({ id: plan.id, data });
      posthog.capture("plan_updated", { plan_id: plan.id, name: data.name, duration_days: data.durationDays, price: data.price });
    } else {
      await createPlan.mutateAsync(data);
      posthog.capture("plan_created", { name: data.name, duration_days: data.durationDays, price: data.price });
    }
    onSuccess();
  });

  const presetDurations = [
    { label: "1 Month", days: 30 },
    { label: "3 Months", days: 90 },
    { label: "6 Months", days: 180 },
    { label: "12 Months", days: 365 },
  ];

  const activeMutation = isEditing ? updatePlan : createPlan;
  const globalError = activeMutation.error instanceof Error ? activeMutation.error.message : "";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {globalError && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
          {globalError}
        </div>
      )}

      <Input
        id="name"
        label="Plan Name *"
        placeholder="e.g., Monthly, Quarterly"
        {...register("name", { required: "Plan name is required" })}
        required
        error={errors.name?.message}
      />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {presetDurations.map((preset) => (
            <button
              key={preset.days}
              type="button"
              onClick={() => setValue("durationDays", preset.days.toString())}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                watch("durationDays") === preset.days.toString()
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <Input
          id="durationDays"
          type="number"
          placeholder="Custom days"
          {...register("durationDays", { required: "Duration is required" })}
          required
          error={errors.durationDays?.message}
        />
      </div>

      <Input
        id="price"
        type="number"
        label="Price (INR) *"
        placeholder="e.g., 1000"
        {...register("price", { required: "Price is required" })}
        required
        error={errors.price?.message}
      />

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={activeMutation.isPending || isSubmitting}
          className="flex-1"
        >
          {isEditing ? "Save Changes" : "Create Plan"}
        </Button>
      </div>
    </form>
  );
}
