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

interface AddMemberFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddMemberForm({ onSuccess, onCancel }: AddMemberFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    planId: "",
    amountPaid: "",
    paymentMode: "CASH",
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/plans");
      const data = await res.json();
      setPlans(data.plans || []);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    }
  };

  const selectedPlan = plans.find((p) => p.id === formData.planId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/members", {
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
        throw new Error(data.error || "Failed to add member");
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="name"
          label="Name *"
          placeholder="Member name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          id="phone"
          label="Phone *"
          placeholder="+91 9876543210"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>

      <Input
        id="email"
        type="email"
        label="Email"
        placeholder="member@email.com"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />

      <Input
        id="address"
        label="Address"
        placeholder="Full address"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
      />

      <div className="border-t border-slate-100 pt-4 mt-4">
        <h3 className="font-medium text-slate-900 mb-4">Membership Details</h3>

        <Select
          id="planId"
          label="Membership Plan"
          value={formData.planId}
          onChange={(e) =>
            setFormData({
              ...formData,
              planId: e.target.value,
              amountPaid: "",
            })
          }
        >
          <option value="">Select a plan (optional)</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name} - {formatCurrency(plan.price)} ({plan.durationDays}{" "}
              days)
            </option>
          ))}
        </Select>

        {formData.planId && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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
        )}
      </div>

      <Input
        id="notes"
        label="Notes"
        placeholder="Any additional notes..."
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
        <Button type="submit" isLoading={isLoading} className="flex-1">
          Add Member
        </Button>
      </div>
    </form>
  );
}
