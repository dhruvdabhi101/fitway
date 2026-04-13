import { useQuery } from "@tanstack/react-query";
import { paymentService, type PaymentDueItem } from "@src/services/payment.service";
import { queryKeys, type PaymentFilter } from "@src/api/query-client";

export function usePaymentsDue(filter: PaymentFilter = "all") {
  return useQuery<PaymentDueItem[]>({
    queryKey: queryKeys.payments.list(filter),
    queryFn: () => paymentService.getDue(filter),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
