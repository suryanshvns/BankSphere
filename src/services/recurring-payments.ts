import { apiRequest } from "./client";

export type RecurringPayment = {
  id: string;
  from_account_id: string;
  to_account_id: string;
  amount: string;
  frequency: string;
  next_run_at?: string;
  active?: boolean;
  [key: string]: unknown;
};

/**
 * ```bash
 * curl -s -X POST "${API}/recurring-payments" \
 *   -H "Authorization: Bearer ${TOKEN}" \
 *   -H "Content-Type: application/json" \
 *   -d '{"from_account_id":"...","to_account_id":"...","amount":"10.00","frequency":"MONTHLY","next_run_at":"2026-04-01T00:00:00Z"}'
 * ```
 */
export function createRecurringPayment(body: {
  from_account_id: string;
  to_account_id: string;
  amount: string;
  frequency: string;
  next_run_at: string;
}) {
  return apiRequest<RecurringPayment>({
    method: "POST",
    url: "/recurring-payments",
    data: body,
  });
}

/**
 * ```bash
 * curl -s "${API}/recurring-payments" -H "Authorization: Bearer ${TOKEN}"
 * ```
 */
export function listRecurringPayments() {
  return apiRequest<RecurringPayment[]>({
    method: "GET",
    url: "/recurring-payments",
  });
}

/**
 * ```bash
 * curl -s -X PATCH "${API}/recurring-payments/${ID}/active" \
 *   -H "Authorization: Bearer ${TOKEN}" \
 *   -H "Content-Type: application/json" \
 *   -d '{"active":false}'
 * ```
 */
export function setRecurringPaymentActive(id: string, active: boolean) {
  return apiRequest<RecurringPayment>({
    method: "PATCH",
    url: `/recurring-payments/${id}/active`,
    data: { active },
  });
}
