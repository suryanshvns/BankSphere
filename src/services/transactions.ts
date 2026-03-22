import { apiRequest } from "./client";
import type { Transaction } from "./types";
import { toQueryString } from "./query-utils";

export type DepositBody = {
  account_id: string;
  amount: string;
  idempotency_key: string;
  description?: string;
  client_reference?: string;
};

export function deposit(body: DepositBody) {
  return apiRequest<Transaction>({
    method: 'POST',
    url: '/transactions/deposit',
    data: body,
  });
}

export type WithdrawBody = {
  account_id: string;
  amount: string;
  idempotency_key: string;
  description?: string;
  client_reference?: string;
};

export function withdraw(body: WithdrawBody) {
  return apiRequest<Transaction>({
    method: 'POST',
    url: '/transactions/withdraw',
    data: body,
  });
}

export type TransferBody = {
  from_account_id: string;
  to_account_id: string;
  amount: string;
  idempotency_key: string;
  description?: string;
  client_reference?: string;
};

export function transfer(body: TransferBody) {
  return apiRequest<Transaction>({
    method: 'POST',
    url: '/transactions/transfer',
    data: body,
  });
}

export type TransactionListQuery = {
  account_id?: string;
  kind?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;
};

export type TransactionListResult =
  | Transaction[]
  | {
      items?: Transaction[];
      data?: Transaction[];
      page?: number;
      page_size?: number;
      total?: number;
    };

/**
 * ```bash
 * curl -s "${API}/transactions?account_id=&kind=&status=&date_from=&date_to=&page=1&page_size=10" \
 *   -H "Authorization: Bearer ${TOKEN}"
 * ```
 */
export function listTransactions(params?: TransactionListQuery) {
  return apiRequest<TransactionListResult>({
    method: "GET",
    url: `/transactions${params ? toQueryString(params as Record<string, string | number | boolean | undefined | null>) : ""}`,
  });
}

/**
 * ```bash
 * curl -s -X POST "${API}/transactions/${ID}/retry" \
 *   -H "Authorization: Bearer ${TOKEN}" \
 *   -H "Content-Type: application/json" \
 *   -d '{"idempotency_key":"<NEW_UNIQUE_KEY>"}'
 * ```
 */
export function retryTransaction(
  transactionId: string,
  body: { idempotency_key: string }
) {
  return apiRequest<Transaction>({
    method: "POST",
    url: `/transactions/${transactionId}/retry`,
    data: body,
  });
}

export function getTransactionById(transactionId: string) {
  return apiRequest<Transaction>({
    method: 'GET',
    url: `/transactions/${transactionId}`,
  });
}
