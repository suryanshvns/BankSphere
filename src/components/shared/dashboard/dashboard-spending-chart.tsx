"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Transaction } from "@/services/types";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";

type DashboardSpendingChartProps = {
  transactions: Transaction[] | undefined;
  isLoading: boolean;
};

export function DashboardSpendingChart({
  transactions,
  isLoading,
}: DashboardSpendingChartProps) {
  const chartData = useMemo(() => {
    if (!transactions?.length) return [];
    const byType: Record<string, number> = {};
    for (const t of transactions) {
      const k = t.type ?? "OTHER";
      const amt = Math.abs(parseFloat(t.amount ?? "0"));
      byType[k] = (byType[k] ?? 0) + (Number.isNaN(amt) ? 0 : amt);
    }
    return Object.entries(byType).map(([name, total]) => ({
      name,
      total: Math.round(total * 100) / 100,
    }));
  }, [transactions]);

  return (
    <GlassCard className="min-h-[280px] min-w-0">
      <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
        Spending by type
      </p>
      {isLoading ? (
        <Skeleton className="mt-4 h-[200px] w-full" />
      ) : chartData.length === 0 ? (
        <p className="mt-8 text-center text-sm text-zinc-500">
          No transaction data yet
        </p>
      ) : (
        <div className="mt-4 h-[220px] min-h-[220px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
              <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} />
              <YAxis stroke="#a1a1aa" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "rgba(15,15,20,0.92)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                }}
              />
              <Bar dataKey="total" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
}
