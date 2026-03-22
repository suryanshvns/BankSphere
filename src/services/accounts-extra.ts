import { apiClient, apiRequest } from "./client";
import type { Account } from "./types";
import { toQueryString } from "./query-utils";

export type AccountBalance = {
  account_id: string;
  balance?: string;
  currency?: string;
  available?: string;
  [key: string]: unknown;
};

/**
 * ```bash
 * curl -s "${API}/accounts/${ACCOUNT_ID}/balance" -H "Authorization: Bearer ${TOKEN}"
 * ```
 */
export function getAccountBalance(accountId: string) {
  return apiRequest<AccountBalance>({
    method: "GET",
    url: `/accounts/${accountId}/balance`,
  });
}

/**
 * ```bash
 * curl -s -X PATCH "${API}/accounts/${ACCOUNT_ID}" -H "Authorization: Bearer ${TOKEN}" \
 *   -H "Content-Type: application/json" \
 *   -d '{"nickname":"Primary"}'
 * ```
 */
export function patchAccountNickname(accountId: string, nickname: string) {
  return apiRequest<Account>({
    method: "PATCH",
    url: `/accounts/${accountId}`,
    data: { nickname },
  });
}

export type StatementPage = {
  items?: unknown[];
  transactions?: unknown[];
  page?: number;
  page_size?: number;
  total?: number;
  [key: string]: unknown;
};

/**
 * ```bash
 * curl -s "${API}/accounts/${ID}/statement?page=1&page_size=10&date_from=&date_to=" \
 *   -H "Authorization: Bearer ${TOKEN}"
 * ```
 */
export function getAccountStatement(
  accountId: string,
  params: {
    page?: number;
    page_size?: number;
    date_from?: string;
    date_to?: string;
  }
) {
  return apiRequest<StatementPage>({
    method: "GET",
    url: `/accounts/${accountId}/statement${toQueryString(params)}`,
  });
}

/**
 * ```bash
 * curl -s "${API}/accounts/${ID}/statement.csv" -H "Authorization: Bearer ${TOKEN}" -o stmt.csv
 * ```
 */
export async function getAccountStatementCsvBlob(
  accountId: string
): Promise<Blob> {
  const res = await apiClient.get<Blob>(
    `/accounts/${accountId}/statement.csv`,
    { responseType: "blob" }
  );
  return res.data;
}
