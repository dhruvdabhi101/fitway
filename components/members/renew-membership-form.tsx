"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { usePlans } from "@src/queries/plan.queries";
import { useRenewMembership } from "@src/queries/member.queries";
import type { MembershipPlan } from "@/app/generated/prisma/client";

interface RenewMembershipFormProps {
  memberId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface RenewMembershipFormValues {
  planId: string;
  amountPaid: string;
  paymentMode: string;
  startDate: string;
}

export function RenewMembershipForm({
  memberId,
  onSuccess,
  onCancel,
}: RenewMembershipFormProps) {
  const { data: plans = [], isLoading: isPlansLoading } = usePlans();
  const renewMembership = useRenewMembership();

  const defaultStartDate = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<RenewMembershipFormValues>({
    defaultValues: {
      planId: "",
      amountPaid: "",
      paymentMode: "CASH",
      startDate: defaultStartDate,
    },
  });

  const selectedPlanId = watch("planId");
  const selectedPlan = (plans as MembershipPlan[]).find((p) => p.id === selectedPlanId);

  useEffect(() => {
    if (plans.length > 0 && !selectedPlanId) {
      setValue("planId", plans[0].id);
    }
  }, [plans, selectedPlanId, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    if (!values.planId) {
      throw new Error("Please select a plan");
    }

    await renewMembership.mutateAsync({
      id: memberId,
      data: {
        planId: values.planId,
        amountPaid: values.amountPaid ? parseFloat(values.amountPaid) : undefined,
        paymentMode: values.paymentMode as "CASH" | "UPI" | "CARD" | "BANK_TRANSFER" | "OTHER",
        startDate: values.startDate,
      },
    });
    onSuccess();
  });

  const globalError =
    (renewMembership.error instanceof Error && renewMembership.error.message) || "";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {globalError && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
          {globalError}
        </div>
      )}

      {plans.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-slate-500 mb-4">
            No membership plans available. Create a plan first.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => (window.location.href = "/plans")}
          >
            Go to Plans
          </Button>
        </div>
      ) : (
        <>
          <Select
            id="planId"
            label="Membership Plan *"
            {...register("planId", { required: "Plan is required" })}
            required
            error={errors.planId?.message}
          >
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} - {formatCurrency(plan.price)} ({plan.durationDays} days)
              </option>
            ))}
          </Select>

          <Input
            id="startDate"
            type="date"
            label="Start Date"
            {...register("startDate", { required: "Start date is required" })}
            error={errors.startDate?.message}
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
              isLoading={renewMembership.isPending || isSubmitting || isPlansLoading}
              className="flex-1"
            >
              Renew Membership
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
