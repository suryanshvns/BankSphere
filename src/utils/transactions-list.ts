import type { Transaction } from "@/services/types";
import type { TransactionListResult } from "@/services/transactions";

export function normalizeTransactionList(
  result: TransactionListResult | undefined
): Transaction[] {
  if (!result) return [];
  if (Array.isArray(result)) return result;
  if (Array.isArray(result.items)) return result.items;
  if (Array.isArray(result.data)) return result.data;
  return [];
}

export type ParsedTransactionList = {
  items: Transaction[];
  total: number;
  page?: number;
  page_size?: number;
};

export function parseTransactionListResult(
  result: TransactionListResult | undefined
): ParsedTransactionList {
  const items = normalizeTransactionList(result);
  if (!result || Array.isArray(result)) {
    return { items, total: items.length };
  }
  return {
    items,
    total: typeof result.total === "number" ? result.total : items.length,
    page: result.page,
    page_size: result.page_size,
  };
}
