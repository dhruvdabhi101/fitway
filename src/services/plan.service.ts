import { apiClient } from "@src/api/client";
import type { CreatePlanInput, UpdatePlanInput } from "@src/api/types";
import type { MembershipPlan } from "@/app/generated/prisma/client";

interface ApiResponse<T> {
  data: T | null;
  error: { code: string; message: string } | null;
}

export const planService = {
  getAll: async (): Promise<MembershipPlan[]> => {
    const response = await apiClient.get<ApiResponse<MembershipPlan[]>>("/api/plans");

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data || [];
  },

  getById: async (id: string): Promise<MembershipPlan> => {
    const response = await apiClient.get<ApiResponse<MembershipPlan>>(`/api/plans/${id}`);

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error("Plan not found");
    }

    return response.data;
  },

  create: async (data: CreatePlanInput): Promise<MembershipPlan> => {
    const response = await apiClient.post<ApiResponse<MembershipPlan>>("/api/plans", data);

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error("Failed to create plan");
    }

    return response.data;
  },

  update: async (id: string, data: UpdatePlanInput): Promise<MembershipPlan> => {
    const response = await apiClient.put<ApiResponse<MembershipPlan>>(`/api/plans/${id}`, data);

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error("Failed to update plan");
    }

    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(`/api/plans/${id}`);

    if (response.error) {
      throw new Error(response.error.message);
    }
  },
};
