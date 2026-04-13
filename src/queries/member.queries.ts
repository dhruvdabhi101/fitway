import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memberService } from "@src/services/member.service";
import { queryKeys, type MemberFilters } from "@src/api/query-client";
import type {
  MemberWithMemberships,
  CreateMemberInput,
  UpdateMemberInput,
  RenewMembershipInput,
} from "@src/api/types";

export function useMembers(filters: MemberFilters = {}) {
  return useQuery({
    queryKey: queryKeys.members.list(filters),
    queryFn: () => memberService.getAll(filters),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useMember(id: string) {
  return useQuery({
    queryKey: queryKeys.members.detail(id),
    queryFn: () => memberService.getById(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMemberInput) => memberService.create(data),
    onMutate: async (newMember) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.members.lists() });

      const previousMembers = queryClient.getQueriesData<MemberWithMemberships[]>({
        queryKey: queryKeys.members.lists(),
      });

      queryClient.setQueriesData<MemberWithMemberships[]>(
        { queryKey: queryKeys.members.lists() },
        (old) => {
          if (!old) return old;
          const optimisticMember: MemberWithMemberships = {
            id: `temp-${Date.now()}`,
            gymOwnerId: "",
            name: newMember.name,
            phone: newMember.phone,
            email: newMember.email || null,
            address: newMember.address || null,
            notes: newMember.notes || null,
            photoUrl: newMember.photoUrl || null,
            joinDate: new Date(),
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            memberships: [],
          };
          return [optimisticMember, ...old];
        }
      );

      return { previousMembers };
    },
    onError: (_err, _newMember, context) => {
      if (context?.previousMembers) {
        context.previousMembers.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members.lists() });
    },
  });
}

export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMemberInput }) =>
      memberService.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.members.detail(id) });

      const previousMember = queryClient.getQueryData<MemberWithMemberships>(
        queryKeys.members.detail(id)
      );

      queryClient.setQueryData<MemberWithMemberships>(
        queryKeys.members.detail(id),
        (old) => {
          if (!old) return old;
          return { ...old, ...data };
        }
      );

      return { previousMember };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousMember) {
        queryClient.setQueryData(
          queryKeys.members.detail(_variables.id),
          context.previousMember
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.members.lists() });
    },
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => memberService.delete(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.members.lists() });

      const previousMembers = queryClient.getQueriesData<MemberWithMemberships[]>({
        queryKey: queryKeys.members.lists(),
      });

      queryClient.setQueriesData<MemberWithMemberships[]>(
        { queryKey: queryKeys.members.lists() },
        (old) => {
          if (!old) return old;
          return old.map((member) =>
            member.id === deletedId ? { ...member, isActive: false } : member
          );
        }
      );

      return { previousMembers };
    },
    onError: (_err, _deletedId, context) => {
      if (context?.previousMembers) {
        context.previousMembers.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members.lists() });
    },
  });
}

export function useRenewMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RenewMembershipInput }) =>
      memberService.renew(id, data),
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.lists() });
    },
  });
}
