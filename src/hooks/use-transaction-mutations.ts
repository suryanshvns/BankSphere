import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import {
  deposit,
  retryTransaction,
  transfer,
  withdraw,
} from "@/services/transactions";
import type {
  DepositBody,
  TransferBody,
  WithdrawBody,
} from "@/services/transactions";
import { queryKeys } from "@/hooks/query-keys";

function invalidateMoneyQueries(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: ["transactions"] });
  void queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
}

export function useDepositMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: DepositBody) => deposit(body),
    onSuccess: () => invalidateMoneyQueries(queryClient),
  });
}

export function useWithdrawMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: WithdrawBody) => withdraw(body),
    onSuccess: () => invalidateMoneyQueries(queryClient),
  });
}

export function useTransferMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: TransferBody) => transfer(body),
    onSuccess: () => invalidateMoneyQueries(queryClient),
  });
}

export function useRetryTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; idempotency_key: string }) =>
      retryTransaction(args.id, { idempotency_key: args.idempotency_key }),
    onSuccess: () => invalidateMoneyQueries(queryClient),
  });
}
