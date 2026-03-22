import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAccount,
  getAccountById,
  listAccounts,
} from "@/services/accounts";
import type { CreateAccountBody } from "@/services/accounts";
import {
  getAccountBalance,
  getAccountStatement,
  patchAccountNickname,
} from "@/services/accounts-extra";
import { queryKeys } from "@/hooks/query-keys";

export function useAccountsQuery() {
  return useQuery({
    queryKey: queryKeys.accounts,
    queryFn: listAccounts,
  });
}

export function useAccountDetailQuery(accountId: string | null) {
  return useQuery({
    queryKey: accountId ? queryKeys.accountDetail(accountId) : ["accounts", "none"],
    queryFn: () => getAccountById(accountId as string),
    enabled: Boolean(accountId),
  });
}

export function useCreateAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateAccountBody) => createAccount(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });
}

export function useAccountBalanceQuery(accountId: string | null) {
  return useQuery({
    queryKey: accountId
      ? queryKeys.accountBalance(accountId)
      : ["accounts", "balance", "none"],
    queryFn: () => getAccountBalance(accountId as string),
    enabled: Boolean(accountId),
  });
}

export function useAccountStatementQuery(
  accountId: string | null,
  params: {
    page?: number;
    page_size?: number;
    date_from?: string;
    date_to?: string;
  }
) {
  return useQuery({
    queryKey: accountId
      ? queryKeys.accountStatement(accountId, params)
      : ["accounts", "statement", "none"],
    queryFn: () => getAccountStatement(accountId as string, params),
    enabled: Boolean(accountId),
  });
}

export function usePatchAccountNicknameMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { accountId: string; nickname: string }) =>
      patchAccountNickname(args.accountId, args.nickname),
    onSuccess: (_data, args) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.accountDetail(args.accountId),
      });
    },
  });
}
