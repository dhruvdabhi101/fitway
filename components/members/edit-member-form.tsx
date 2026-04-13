"use client";

import { useForm } from "react-hook-form";
import posthog from "posthog-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateMember } from "@src/queries/member.queries";
import type { MemberWithMemberships, UpdateMemberInput } from "@src/api/types";

interface EditMemberFormProps {
  member: MemberWithMemberships;
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
  const updateMember = useUpdateMember();

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

  const onSubmit = handleSubmit(async (values) => {
    const data: UpdateMemberInput = {
      name: values.name,
      phone: values.phone,
      email: values.email || undefined,
      address: values.address || undefined,
      notes: values.notes || undefined,
    };
    await updateMember.mutateAsync({ id: member.id, data });
    posthog.capture("member_updated", { member_id: member.id });
    onSuccess();
  });

  const globalError =
    updateMember.error instanceof Error ? updateMember.error.message : "";

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
          isLoading={updateMember.isPending || isSubmitting}
          className="flex-1"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}
