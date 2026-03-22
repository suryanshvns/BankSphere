import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOutboundPayment,
  listOutboundPayments,
  type CreateOutboundPaymentBody,
} from "@/services/platform-payments";
import { queryKeys } from "@/hooks/query-keys";

export function useOutboundPaymentsQuery() {
  return useQuery({
    queryKey: queryKeys.outboundPayments,
    queryFn: listOutboundPayments,
  });
}

export function useCreateOutboundPaymentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateOutboundPaymentBody) =>
      createOutboundPayment(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.outboundPayments,
      });
    },
  });
}
