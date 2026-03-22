import { apiRequest } from './client';
import type { Loan } from './types';

export type LoanApplyBody = {
  principal: string;
  annual_rate_pct: string;
  tenure_months: number;
  purpose: string;
};

export function applyForLoan(body: LoanApplyBody) {
  return apiRequest<Loan>({
    method: 'POST',
    url: '/loans/apply',
    data: body,
  });
}

export function listLoans() {
  return apiRequest<Loan[]>({ method: 'GET', url: '/loans' });
}

export function getLoanById(loanId: string) {
  return apiRequest<Loan>({ method: 'GET', url: `/loans/${loanId}` });
}
