"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Transaction } from "@/services/types";
import { formatCurrency } from "@/utils/money";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/badge";

type DashboardRecentTransactionsProps = {
  transactions: Transaction[] | undefined;
  isLoading: boolean;
  currency: string;
};

export function DashboardRecentTransactions({
  transactions,
  isLoading,
  currency,
}: DashboardRecentTransactionsProps) {
  const recent = useMemo(() => {
    if (!transactions) return [];
    return [...transactions]
      .sort(
        (a, b) =>
          new Date(b.created_at ?? 0).getTime() -
          new Date(a.created_at ?? 0).getTime()
      )
      .slice(0, 6);
  }, [transactions]);

  return (
    <GlassCard className="min-w-0">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
          Recent transactions
        </p>
        <Link
          href="/transactions"
          className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
        >
          View all
        </Link>
      </div>
      <ul className="mt-4 space-y-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="flex justify-between gap-2">
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-16" />
              </li>
            ))
          : recent.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 last:border-0 light:border-zinc-200/60"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-zinc-200 light:text-zinc-800">
                    {t.description || t.type || "Transaction"}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {t.created_at
                      ? new Date(t.created_at).toLocaleString()
                      : "—"}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-sm font-medium text-white light:text-zinc-900">
                    {formatCurrency(t.amount ?? 0, currency)}
                  </span>
                  <StatusBadge status={t.status} />
                </div>
              </li>
            ))}
        {!isLoading && recent.length === 0 ? (
          <li className="text-sm text-zinc-500">No recent activity</li>
        ) : null}
      </ul>
    </GlassCard>
  );
}
