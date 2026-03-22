import { apiRequest } from "./client";

export type LoanProduct = {
  id?: string;
  code?: string;
  name?: string;
  min_principal?: string;
  max_principal?: string;
  rate_range?: string;
  [key: string]: unknown;
};

export type LoanScheduleEntry = {
  installment_no?: number;
  due_date?: string;
  principal?: string;
  interest?: string;
  emi?: string;
  [key: string]: unknown;
};

/**
 * ```bash
 * curl -s "${API}/loans/products" -H "Authorization: Bearer ${TOKEN}"
 * ```
 */
export function listLoanProducts() {
  return apiRequest<LoanProduct[]>({ method: "GET", url: "/loans/products" });
}

/**
 * ```bash
 * curl -s "${API}/loans/${LOAN_ID}/schedule" -H "Authorization: Bearer ${TOKEN}"
 * ```
 */
export function getLoanSchedule(loanId: string) {
  return apiRequest<LoanScheduleEntry[]>({
    method: "GET",
    url: `/loans/${loanId}/schedule`,
  });
}

/**
 * ```bash
 * curl -s -X POST "${API}/loans/${LOAN_ID}/prepay" \
 *   -H "Authorization: Bearer ${TOKEN}" \
 *   -H "Content-Type: application/json" \
 *   -d '{"amount":"50.00"}'
 * ```
 */
export function prepayLoan(loanId: string, amount: string) {
  return apiRequest<Record<string, unknown>>({
    method: "POST",
    url: `/loans/${loanId}/prepay`,
    data: { amount },
  });
}

export type LoanInstallmentRow = {
  installment_no?: number;
  due_date?: string;
  amount?: string;
  principal?: string;
  interest?: string;
  status?: string;
  [key: string]: unknown;
};

/**
 * ```bash
 * curl -s "${API}/loans/${LOAN_UUID}/installments" -H "Authorization: Bearer ${TOKEN}"
 * ```
 */
export function listLoanInstallments(loanId: string) {
  return apiRequest<LoanInstallmentRow[]>({
    method: "GET",
    url: `/loans/${loanId}/installments`,
  });
}

/**
 * ```bash
 * curl -s -X POST "${API}/loans/${LOAN_UUID}/installments/1/pay" \
 *   -H "Authorization: Bearer ${TOKEN}" \
 *   -H "Content-Type: application/json" \
 *   -d '{"from_account_id":"ACCOUNT_UUID"}'
 * ```
 */
export function payLoanInstallment(
  loanId: string,
  installmentNo: number,
  from_account_id: string
) {
  return apiRequest<Record<string, unknown>>({
    method: "POST",
    url: `/loans/${loanId}/installments/${installmentNo}/pay`,
    data: { from_account_id },
  });
}
