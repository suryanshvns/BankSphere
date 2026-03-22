import type { TransactionListQuery } from "@/services/transactions";

export const queryKeys = {
  health: ["health"] as const,
  accounts: ["accounts"] as const,
  accountDetail: (id: string) => ["accounts", id] as const,
  accountBalance: (id: string) => ["accounts", id, "balance"] as const,
  accountStatement: (
    id: string,
    params: {
      page?: number;
      page_size?: number;
      date_from?: string;
      date_to?: string;
    }
  ) => ["accounts", id, "statement", params] as const,
  transactionsList: (p: TransactionListQuery = {}) =>
    [
      "transactions",
      "list",
      p.account_id ?? null,
      p.kind ?? null,
      p.status ?? null,
      p.date_from ?? null,
      p.date_to ?? null,
      p.page ?? null,
      p.page_size ?? null,
    ] as const,
  loans: ["loans"] as const,
  loanProducts: ["loans", "products"] as const,
  loanSchedule: (loanId: string) => ["loans", loanId, "schedule"] as const,
  loanInstallments: (loanId: string) =>
    ["loans", loanId, "installments"] as const,
  outboundPayments: ["platform", "payments", "outbound"] as const,
  supportCases: ["platform", "support", "cases"] as const,
  userMe: ["users", "me"] as const,
  userLimits: ["users", "me", "limits"] as const,
  notifications: ["notifications"] as const,
  authSessions: ["auth", "sessions"] as const,
  recurringPayments: ["recurring-payments"] as const,
  beneficiaries: ["beneficiaries"] as const,
  cards: ["cards"] as const,
};
