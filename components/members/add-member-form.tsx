"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

interface Plan {
  id: string;
  name: string;
  durationDays: number;
  price: number;
}

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
}

export function AddMemberForm({ onSuccess, onCancel }: AddMemberFormProps) {
  const queryClient = useQueryClient();

  const {
    data: plans = [],
    isLoading: isPlansLoading,
    error: plansError,
  } = useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await fetch("/api/plans");
      const data = await res.json();
      return data.plans || [];
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
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
    },
  });

  const selectedPlanId = watch("planId");
  const plansMap = plans as Plan[];
  const selectedPlan = plansMap.find((p) => p.id === selectedPlanId);

  useEffect(() => {
    if (!selectedPlanId) {
      setValue("amountPaid", "");
    }
  }, [selectedPlanId, setValue]);

  const addMemberMutation = useMutation({
    mutationFn: async (values: AddMemberFormValues) => {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          amountPaid: values.amountPaid
            ? parseFloat(values.amountPaid)
            : selectedPlan?.price,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add member");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      reset();
      onSuccess();
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await addMemberMutation.mutateAsync(values);
  });

  const globalError =
    (plansError instanceof Error && plansError.message) ||
    (addMemberMutation.error instanceof Error &&
      addMemberMutation.error.message) ||
    "";

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
              {plan.name} - {formatCurrency(plan.price)} ({plan.durationDays}{" "}
              days)
            </option>
          ))}
        </Select>

        {selectedPlanId && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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
          isLoading={addMemberMutation.isPending || isSubmitting || isPlansLoading}
          className="flex-1"
        >
          Add Member
        </Button>
      </div>
    </form>
  );
}
