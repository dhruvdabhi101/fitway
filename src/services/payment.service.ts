import { apiClient } from "@src/api/client";
import { type PaymentFilter } from "@src/api/query-client";

export interface PaymentDueItem {
  id: string;
  memberId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  amountPaid: number;
  paymentStatus: string;
  paymentMode: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  member: {
    id: string;
    name: string;
    phone: string;
    photoUrl: string | null;
  };
  plan: {
    name: string;
  };
}

export const paymentService = {
  getDue: async (filter: PaymentFilter = "all"): Promise<PaymentDueItem[]> => {
    const response = await apiClient.get<{ data: PaymentDueItem[] | null; error: { code: string; message: string } | null }>("/api/payments/due", {
      params: { filter },
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data || [];
  },
};
