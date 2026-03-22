import { apiRequest } from "./client";

export type Beneficiary = {
  id: string;
  display_name: string;
  beneficiary_account_id: string;
  created_at?: string;
  [key: string]: unknown;
};

/**
 * ```bash
 * curl -s -X POST "${API}/beneficiaries" \
 *   -H "Authorization: Bearer ${TOKEN}" \
 *   -H "Content-Type: application/json" \
 *   -d '{"display_name":"Payee","beneficiary_account_id":"..."}'
 * ```
 */
export function createBeneficiary(body: {
  display_name: string;
  beneficiary_account_id: string;
}) {
  return apiRequest<Beneficiary>({
    method: "POST",
    url: "/beneficiaries",
    data: body,
  });
}

/**
 * ```bash
 * curl -s "${API}/beneficiaries" -H "Authorization: Bearer ${TOKEN}"
 * ```
 */
export function listBeneficiaries() {
  return apiRequest<Beneficiary[]>({ method: "GET", url: "/beneficiaries" });
}

/**
 * ```bash
 * curl -s -X DELETE "${API}/beneficiaries/${ID}" \
 *   -H "Authorization: Bearer ${TOKEN}"
 * ```
 */
export function deleteBeneficiary(id: string) {
  return apiRequest<{ ok?: boolean }>({
    method: "DELETE",
    url: `/beneficiaries/${id}`,
  });
}
