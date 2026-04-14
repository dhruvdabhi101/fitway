"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import posthog from "posthog-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { usePlans } from "@src/queries/plan.queries";
import { useCreateMember } from "@src/queries/member.queries";
import type { MembershipPlan } from "@/app/generated/prisma/client";

interface AddMemberFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface AddMemberFormValues {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  planId: string;
  amountPaid: string;
  paymentMode: string;
  startDate: string;
}

export function AddMemberForm({ onSuccess, onCancel }: AddMemberFormProps) {
  const { data: plans = [], isLoading: isPlansLoading } = usePlans();
  const createMember = useCreateMember();

  const defaultStartDate = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<AddMemberFormValues>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
      planId: "",
      amountPaid: "",
      paymentMode: "CASH",
      startDate: "",
    },
  });

  const selectedPlanId = watch("planId");
  const selectedPlan = (plans as MembershipPlan[]).find((p) => p.id === selectedPlanId);

  useEffect(() => {
    if (!selectedPlanId) {
      setValue("amountPaid", "");
    }
  }, [selectedPlanId, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    await createMember.mutateAsync({
      name: values.name,
      phone: values.phone,
      email: values.email || undefined,
      address: values.address || undefined,
      notes: values.notes || undefined,
      planId: values.planId || undefined,
      amountPaid: values.amountPaid ? parseFloat(values.amountPaid) : undefined,
      paymentMode: values.paymentMode as "CASH" | "UPI" | "CARD" | "BANK_TRANSFER" | "OTHER",
      startDate: values.startDate || undefined,
    });
    posthog.capture("member_added", {
      plan_id: values.planId || null,
      plan_name: selectedPlan?.name || null,
      amount_paid: values.amountPaid ? parseFloat(values.amountPaid) : null,
      payment_mode: values.paymentMode,
    });
    reset();
    onSuccess();
  });

  const globalError =
    (createMember.error instanceof Error && createMember.error.message) || "";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {globalError && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
          {globalError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="name"
          label="Name *"
          placeholder="Member name"
          {...register("name", { required: "Name is required" })}
          required
          error={errors.name?.message}
        />
        <Input
          id="phone"
          label="Phone *"
          placeholder="+91 9876543210"
          {...register("phone", { required: "Phone is required" })}
          required
          error={errors.phone?.message}
        />
      </div>

      <Input
        id="email"
        type="email"
        label="Email"
        placeholder="member@email.com"
        {...register("email")}
      />

      <Input
        id="address"
        label="Address"
        placeholder="Full address"
        {...register("address")}
      />

      <div className="border-t border-slate-100 pt-4 mt-4">
        <h3 className="font-medium text-slate-900 mb-4">Membership Details</h3>

        <Select
          id="planId"
          label="Membership Plan"
          {...register("planId")}
        >
          <option value="">Select a plan (optional)</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name} - {formatCurrency(plan.price)} ({plan.durationDays} days)
            </option>
          ))}
        </Select>

        {selectedPlanId && (
          <div className="space-y-4 mt-4">
            <Input
              id="startDate"
              type="date"
              label="Membership Start Date"
              placeholder={defaultStartDate}
              {...register("startDate")}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="amountPaid"
                type="number"
                label="Amount Paid"
                placeholder={selectedPlan ? `${selectedPlan.price}` : "0"}
                {...register("amountPaid")}
              />
              <Select
                id="paymentMode"
                label="Payment Mode"
                {...register("paymentMode")}
              >
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
                <option value="CARD">Card</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="OTHER">Other</option>
              </Select>
            </div>
          </div>
        )}
      </div>

      <Input
        id="notes"
        label="Notes"
        placeholder="Any additional notes..."
        {...register("notes")}
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={createMember.isPending || isSubmitting || isPlansLoading}
          className="flex-1"
        >
          Add Member
        </Button>
      </div>
    </form>
  );
}
