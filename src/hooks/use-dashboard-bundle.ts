import { useAccountsQuery } from "@/hooks/use-accounts";
import { useTransactionsQuery } from "@/hooks/use-transactions-query";
import { getErrorMessage } from "@/services/client";

export function useDashboardBundle() {
  const accountsQuery = useAccountsQuery();
  const transactionsQuery = useTransactionsQuery({ page: 1, page_size: 100 });

  const isLoading = accountsQuery.isPending || transactionsQuery.isPending;
  const hasError = accountsQuery.isError || transactionsQuery.isError;
  const error = accountsQuery.error ?? transactionsQuery.error;
  const errorMessage = error ? getErrorMessage(error) : null;

  return {
    accounts: accountsQuery.data,
    transactions: transactionsQuery.data?.items,
    isLoading,
    hasError,
    errorMessage,
    refetchAll: () => {
      void accountsQuery.refetch();
      void transactionsQuery.refetch();
    },
  };
}
