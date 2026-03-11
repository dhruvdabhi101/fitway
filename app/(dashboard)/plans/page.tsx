"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Plus, CreditCard, Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Plan {
  id: string;
  name: string;
  durationDays: number;
  price: number;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/plans");
      const data = await res.json();
      setPlans(data.plans || []);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;

    try {
      const res = await fetch(`/api/plans/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPlans();
      }
    } catch (error) {
      console.error("Failed to delete plan:", error);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Membership Plans</h1>
          <p className="text-slate-500 mt-1">
            Create and manage your membership plans
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Plan
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-40 bg-slate-100 rounded-2xl animate-pulse"
            />
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
              <h3 className="text-lg font-semibold text-slate-900">
                {plan.name}
              </h3>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {formatCurrency(plan.price)}
              </p>
              <p className="text-sm text-slate-500 mt-2">
                {plan.durationDays} days
              </p>
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
          onSuccess={() => {
            setIsAddModalOpen(false);
            fetchPlans();
          }}
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
            onSuccess={() => {
              setEditingPlan(null);
              fetchPlans();
            }}
            onCancel={() => setEditingPlan(null)}
          />
        )}
      </Modal>
    </div>
  );
}

interface PlanFormProps {
  plan?: Plan;
  onSuccess: () => void;
  onCancel: () => void;
}

function PlanForm({ plan, onSuccess, onCancel }: PlanFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: plan?.name || "",
    durationDays: plan?.durationDays.toString() || "30",
    price: plan?.price.toString() || "",
  });

  const presetDurations = [
    { label: "1 Month", days: 30 },
    { label: "3 Months", days: 90 },
    { label: "6 Months", days: 180 },
    { label: "12 Months", days: 365 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const url = plan ? `/api/plans/${plan.id}` : "/api/plans";
      const method = plan ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save plan");
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

      <Input
        id="name"
        label="Plan Name *"
        placeholder="e.g., Monthly, Quarterly"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Duration
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {presetDurations.map((preset) => (
            <button
              key={preset.days}
              type="button"
              onClick={() =>
                setFormData({ ...formData, durationDays: preset.days.toString() })
              }
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                formData.durationDays === preset.days.toString()
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
          value={formData.durationDays}
          onChange={(e) =>
            setFormData({ ...formData, durationDays: e.target.value })
          }
          required
        />
      </div>

      <Input
        id="price"
        type="number"
        label="Price (INR) *"
        placeholder="e.g., 1000"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        required
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
          {plan ? "Save Changes" : "Create Plan"}
        </Button>
      </div>
    </form>
  );
}
