import { useQuery } from "@tanstack/react-query";
import {
  listTransactions,
  type TransactionListQuery,
} from "@/services/transactions";
import { queryKeys } from "@/hooks/query-keys";
import { parseTransactionListResult } from "@/utils/transactions-list";

export function useTransactionsQuery(params: TransactionListQuery = {}) {
  return useQuery({
    queryKey: queryKeys.transactionsList(params),
    queryFn: () => listTransactions(params),
    select: parseTransactionListResult,
  });
}
