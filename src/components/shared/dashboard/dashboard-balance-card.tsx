"use client";

import Link from "next/link";
import type { Account } from "@/services/types";
import { formatCurrency } from "@/utils/money";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type DashboardBalanceCardProps = {
  accounts: Account[] | undefined;
  isLoading: boolean;
};

export function DashboardBalanceCard({
  accounts,
  isLoading,
}: DashboardBalanceCardProps) {
  const totalBalance =
    accounts?.reduce((sum, acc) => {
      const b = parseFloat(acc.balance ?? "0");
      return sum + (Number.isNaN(b) ? 0 : b);
    }, 0) ?? 0;
  const primaryCurrency = accounts?.[0]?.currency ?? "USD";
  const count = accounts?.length ?? 0;

  return (
    <GlassCard highlight className="lg:col-span-2">
      <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-linear-to-br from-cyan-400/25 via-violet-500/15 to-transparent blur-3xl light:from-cyan-400/35" />
      <p className="relative text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200/80 light:text-cyan-700">
        Total balance
      </p>
      {isLoading ? (
        <Skeleton className="relative mt-4 h-12 w-56 rounded-lg" />
      ) : (
        <p className="relative mt-2 bg-linear-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent light:from-zinc-900 light:via-zinc-800 light:to-zinc-600">
          {formatCurrency(totalBalance, primaryCurrency)}
        </p>
      )}
      <p className="relative mt-2 text-sm text-zinc-500 light:text-zinc-600">
        Across{" "}
        <span className="font-medium text-zinc-400 light:text-zinc-700">
          {count}
        </span>{" "}
        linked account{count === 1 ? "" : "s"}
      </p>
      <div className="relative mt-7 flex flex-wrap gap-3">
        <Link href="/transfer">
          <Button type="button">Send money</Button>
        </Link>
        <Link href="/accounts">
          <Button type="button" variant="secondary">
            Add / view accounts
          </Button>
        </Link>
      </div>
    </GlassCard>
  );
}
