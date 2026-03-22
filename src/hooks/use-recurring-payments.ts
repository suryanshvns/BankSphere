import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRecurringPayment,
  listRecurringPayments,
  setRecurringPaymentActive,
} from "@/services/recurring-payments";
import { queryKeys } from "@/hooks/query-keys";

export function useRecurringPaymentsQuery() {
  return useQuery({
    queryKey: queryKeys.recurringPayments,
    queryFn: listRecurringPayments,
  });
}

export function useCreateRecurringPaymentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRecurringPayment,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.recurringPayments,
      });
    },
  });
}

export function useSetRecurringActiveMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; active: boolean }) =>
      setRecurringPaymentActive(args.id, args.active),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.recurringPayments,
      });
    },
  });
}
