"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Member {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  notes: string | null;
}

interface EditMemberFormProps {
  member: Member;
  onSuccess: () => void;
  onCancel: () => void;
}

interface EditMemberFormValues {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

export function EditMemberForm({
  member,
  onSuccess,
  onCancel,
}: EditMemberFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EditMemberFormValues>({
    defaultValues: {
      name: member.name,
      phone: member.phone,
      email: member.email || "",
      address: member.address || "",
      notes: member.notes || "",
    },
  });

  const editMemberMutation = useMutation({
    mutationFn: async (values: EditMemberFormValues) => {
      const res = await fetch(`/api/members/${member.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update member");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member", member.id] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      onSuccess();
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await editMemberMutation.mutateAsync(values);
  });

  const globalError =
    editMemberMutation.error instanceof Error
      ? editMemberMutation.error.message
      : "";

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
          {...register("name", { required: "Name is required" })}
          required
          error={errors.name?.message}
        />
        <Input
          id="phone"
          label="Phone *"
          {...register("phone", { required: "Phone is required" })}
          required
          error={errors.phone?.message}
        />
      </div>

      <Input
        id="email"
        type="email"
        label="Email"
        {...register("email")}
      />

      <Input
        id="address"
        label="Address"
        {...register("address")}
      />

      <Input
        id="notes"
        label="Notes"
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
          isLoading={editMemberMutation.isPending || isSubmitting}
          className="flex-1"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}
