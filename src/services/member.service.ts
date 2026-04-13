import { apiClient } from "@src/api/client";
import { type MemberFilters } from "@src/api/query-client";
import type {
  CreateMemberInput,
  UpdateMemberInput,
  RenewMembershipInput,
  MemberWithMemberships,
} from "@src/api/types";

interface ApiResponse<T> {
  data: T | null;
  error: { code: string; message: string } | null;
}

export const memberService = {
  getAll: async (filters?: MemberFilters): Promise<MemberWithMemberships[]> => {
    const params: Record<string, string | number | undefined> = {};
    if (filters?.search) params.search = filters.search;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;

    const response = await apiClient.get<ApiResponse<MemberWithMemberships[]>>("/api/members", {
      params,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data || [];
  },

  getById: async (id: string): Promise<MemberWithMemberships> => {
    const response = await apiClient.get<ApiResponse<MemberWithMemberships>>(`/api/members/${id}`);

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error("Member not found");
    }

    return response.data;
  },

  create: async (data: CreateMemberInput): Promise<MemberWithMemberships> => {
    const response = await apiClient.post<ApiResponse<MemberWithMemberships>>("/api/members", data);

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error("Failed to create member");
    }

    return response.data;
  },

  update: async (id: string, data: UpdateMemberInput): Promise<MemberWithMemberships> => {
    const response = await apiClient.put<ApiResponse<MemberWithMemberships>>(`/api/members/${id}`, data);

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error("Failed to update member");
    }

    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(`/api/members/${id}`);

    if (response.error) {
      throw new Error(response.error.message);
    }
  },

  renew: async (id: string, data: RenewMembershipInput): Promise<MemberWithMemberships> => {
    const response = await apiClient.post<ApiResponse<MemberWithMemberships>>(`/api/members/${id}/renew`, data);

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error("Failed to renew membership");
    }

    return response.data;
  },
};
