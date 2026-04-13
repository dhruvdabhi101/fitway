import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 4000),
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: "always",
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

export const queryKeys = {
  members: {
    all: ["members"] as const,
    lists: () => [...queryKeys.members.all, "list"] as const,
    list: (filters: MemberFilters) => [...queryKeys.members.lists(), filters] as const,
    details: () => [...queryKeys.members.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.members.details(), id] as const,
  },
  plans: {
    all: ["plans"] as const,
    lists: () => [...queryKeys.plans.all, "list"] as const,
    list: () => [...queryKeys.plans.lists()] as const,
  },
  payments: {
    all: ["payments-due"] as const,
    lists: () => [...queryKeys.payments.all, "list"] as const,
    list: (filter: PaymentFilter) => [...queryKeys.payments.lists(), filter] as const,
  },
} as const;

export interface MemberFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export type PaymentFilter = "all" | "overdue" | "expiring";
