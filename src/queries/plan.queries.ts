import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { planService } from "@src/services/plan.service";
import { queryKeys } from "@src/api/query-client";
import type { CreatePlanInput, UpdatePlanInput } from "@src/api/types";
import type { MembershipPlan } from "@/app/generated/prisma/client";

export function usePlans() {
  return useQuery({
    queryKey: queryKeys.plans.list(),
    queryFn: () => planService.getAll(),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function usePlan(id: string) {
  return useQuery({
    queryKey: [...queryKeys.plans.all, "detail", id] as const,
    queryFn: () => planService.getById(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlanInput) => planService.create(data),
    onMutate: async (newPlan) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.plans.lists() });

      const previousPlans = queryClient.getQueryData<MembershipPlan[]>(queryKeys.plans.list());

      const optimisticPlan: MembershipPlan = {
        id: `temp-${Date.now()}`,
        gymOwnerId: "",
        name: newPlan.name,
        durationDays: newPlan.durationDays,
        price: newPlan.price,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      queryClient.setQueryData<MembershipPlan[]>(
        queryKeys.plans.list(),
        (old) => [optimisticPlan, ...(old || [])]
      );

      return { previousPlans };
    },
    onError: (_err, _newPlan, context) => {
      if (context?.previousPlans) {
        queryClient.setQueryData(queryKeys.plans.list(), context.previousPlans);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans.lists() });
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlanInput }) =>
      planService.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.plans.lists() });

      const previousPlans = queryClient.getQueryData<MembershipPlan[]>(queryKeys.plans.list());

      queryClient.setQueryData<MembershipPlan[]>(
        queryKeys.plans.list(),
        (old) => {
          if (!old) return old;
          return old.map((plan) =>
            plan.id === id ? { ...plan, ...data } : plan
          );
        }
      );

      return { previousPlans };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousPlans) {
        queryClient.setQueryData(queryKeys.plans.list(), context.previousPlans);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans.lists() });
    },
  });
}

export function useDeletePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => planService.delete(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.plans.lists() });

      const previousPlans = queryClient.getQueryData<MembershipPlan[]>(queryKeys.plans.list());

      queryClient.setQueryData<MembershipPlan[]>(
        queryKeys.plans.list(),
        (old) => {
          if (!old) return old;
          return old.map((plan) =>
            plan.id === deletedId ? { ...plan, isActive: false } : plan
          );
        }
      );

      return { previousPlans };
    },
    onError: (_err, _deletedId, context) => {
      if (context?.previousPlans) {
        queryClient.setQueryData(queryKeys.plans.list(), context.previousPlans);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans.lists() });
    },
  });
}
