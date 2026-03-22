import { apiRequest } from "./client";

export type BankCard = {
  id: string;
  label?: string;
  last4?: string;
  is_frozen?: boolean;
  status?: string;
  [key: string]: unknown;
};

/**
 * ```bash
 * curl -s -X POST "${API}/cards" \
 *   -H "Authorization: Bearer ${TOKEN}" \
 *   -H "Content-Type: application/json" \
 *   -d '{"label":"Debit","last4":"4242"}'
 * ```
 */
export function createCard(body: { label: string; last4: string }) {
  return apiRequest<BankCard>({ method: "POST", url: "/cards", data: body });
}

/**
 * ```bash
 * curl -s "${API}/cards" -H "Authorization: Bearer ${TOKEN}"
 * ```
 */
export function listCards() {
  return apiRequest<BankCard[]>({ method: "GET", url: "/cards" });
}

/**
 * ```bash
 * curl -s -X PATCH "${API}/cards/${ID}/freeze" \
 *   -H "Authorization: Bearer ${TOKEN}" \
 *   -H "Content-Type: application/json" \
 *   -d '{"is_frozen":true}'
 * ```
 */
export function patchCardFreeze(cardId: string, is_frozen: boolean) {
  return apiRequest<BankCard>({
    method: "PATCH",
    url: `/cards/${cardId}/freeze`,
    data: { is_frozen },
  });
}

/**
 * ```bash
 * curl -s -X POST "${API}/cards/${ID}/cancel" \
 *   -H "Authorization: Bearer ${TOKEN}"
 * ```
 */
export function cancelCard(cardId: string) {
  return apiRequest<BankCard>({
    method: "POST",
    url: `/cards/${cardId}/cancel`,
  });
}
