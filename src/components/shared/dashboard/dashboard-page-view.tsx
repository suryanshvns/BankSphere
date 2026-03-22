"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useDashboardBundle } from "@/hooks/use-dashboard-bundle";
import { DashboardBalanceCard } from "@/components/shared/dashboard/dashboard-balance-card";
import { DashboardQuickActions } from "@/components/shared/dashboard/dashboard-quick-actions";
import { DashboardSpendingChart } from "@/components/shared/dashboard/dashboard-spending-chart";
import { DashboardRecentTransactions } from "@/components/shared/dashboard/dashboard-recent-transactions";

export function DashboardPageView() {
  const {
    accounts,
    transactions,
    isLoading,
    hasError,
    errorMessage,
    refetchAll,
  } = useDashboardBundle();

  useEffect(() => {
    if (hasError && errorMessage) {
      toast.error(errorMessage);
    }
  }, [hasError, errorMessage]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white light:text-zinc-900">
            Dashboard
          </h1>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-zinc-500 light:text-zinc-600">
            Balances, spending, and recent activity — refreshed from your
            accounts.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetchAll()}
          className="rounded-xl border border-white/10 bg-white/4 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-300/90 transition hover:border-cyan-400/35 hover:bg-white/8 light:border-zinc-200 light:bg-white light:text-cyan-700 light:hover:border-cyan-300"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <DashboardBalanceCard accounts={accounts} isLoading={isLoading} />
        <DashboardQuickActions />
      </div>

      <div className="grid min-w-0 gap-5 lg:grid-cols-2">
        <div className="min-w-0">
          <DashboardSpendingChart
            transactions={transactions}
            isLoading={isLoading}
          />
        </div>
        <div className="min-w-0">
          <DashboardRecentTransactions
            transactions={transactions}
            isLoading={isLoading}
            currency={accounts?.[0]?.currency ?? "USD"}
          />
        </div>
      </div>
    </div>
  );
}
