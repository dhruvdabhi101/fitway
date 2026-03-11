"use client";

import { useState, useEffect } from "react";
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

interface RenewMembershipFormProps {
  memberId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function RenewMembershipForm({
  memberId,
  onSuccess,
  onCancel,
}: RenewMembershipFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [formData, setFormData] = useState({
    planId: "",
    amountPaid: "",
    paymentMode: "CASH",
    startDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/plans");
      const data = await res.json();
      setPlans(data.plans || []);
      if (data.plans?.length > 0) {
        setFormData((prev) => ({ ...prev, planId: data.plans[0].id }));
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    }
  };

  const selectedPlan = plans.find((p) => p.id === formData.planId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.planId) {
      setError("Please select a plan");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/members/${memberId}/renew`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amountPaid: formData.amountPaid
            ? parseFloat(formData.amountPaid)
            : selectedPlan?.price,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to renew membership");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
          {error}
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
            value={formData.planId}
            onChange={(e) =>
              setFormData({
                ...formData,
                planId: e.target.value,
                amountPaid: "",
              })
            }
            required
          >
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} - {formatCurrency(plan.price)} ({plan.durationDays}{" "}
                days)
              </option>
            ))}
          </Select>

          <Input
            id="startDate"
            type="date"
            label="Start Date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="amountPaid"
              type="number"
              label="Amount Paid"
              placeholder={selectedPlan ? `${selectedPlan.price}` : "0"}
              value={formData.amountPaid}
              onChange={(e) =>
                setFormData({ ...formData, amountPaid: e.target.value })
              }
            />
            <Select
              id="paymentMode"
              label="Payment Mode"
              value={formData.paymentMode}
              onChange={(e) =>
                setFormData({ ...formData, paymentMode: e.target.value })
              }
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
            <Button type="submit" isLoading={isLoading} className="flex-1">
              Renew Membership
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
