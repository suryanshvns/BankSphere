"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useTransactionsQuery } from "@/hooks/use-transactions-query";
import { useRetryTransactionMutation } from "@/hooks/use-transaction-mutations";
import { useAccountsQuery } from "@/hooks/use-accounts";
import { getErrorMessage } from "@/services/client";
import { formatCurrency } from "@/utils/money";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/badge";

const PAGE_SIZE = 10;

function buildIdempotencyKey(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function isRetryableStatus(status?: string) {
  return /fail|error|reject/i.test(status ?? "");
}

export function TransactionsPageView() {
  const accountsQuery = useAccountsQuery();
  const [page, setPage] = useState(1);
  const [accountId, setAccountId] = useState("");
  const [kind, setKind] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");

  const listParams = useMemo(
    () => ({
      page,
      page_size: PAGE_SIZE,
      account_id: accountId || undefined,
      kind: kind || undefined,
      status: status || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    }),
    [page, accountId, kind, status, dateFrom, dateTo]
  );

  const transactionsQuery = useTransactionsQuery(listParams);
  const retryMutation = useRetryTransactionMutation();

  useEffect(() => {
    if (transactionsQuery.isError && transactionsQuery.error) {
      toast.error(getErrorMessage(transactionsQuery.error));
    }
  }, [transactionsQuery.isError, transactionsQuery.error]);

  const total = transactionsQuery.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE) || 1);
  const isLoading = transactionsQuery.isPending;

  const filtered = useMemo(() => {
    const rawItems = transactionsQuery.data?.items ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return rawItems;
    return rawItems.filter(
      (t) =>
        (t.description?.toLowerCase().includes(q) ?? false) ||
        t.id.toLowerCase().includes(q) ||
        (t.type?.toLowerCase().includes(q) ?? false)
    );
  }, [transactionsQuery.data?.items, search]);

  const handleFilterChange = () => {
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white light:text-zinc-900">
          Transactions
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-400 light:text-zinc-600">
          GET /transactions with server filters; search applies to the current
          page of results.
        </p>
      </div>

      <GlassCard>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div>
            <Label htmlFor="acc">Account</Label>
            <Select
              id="acc"
              className="mt-1.5"
              value={accountId}
              onChange={(e) => {
                setAccountId(e.target.value);
                handleFilterChange();
              }}
            >
              <option value="">All accounts</option>
              {(accountsQuery.data ?? []).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nickname || a.type} ({a.currency})
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="kind">Kind / type</Label>
            <Input
              id="kind"
              placeholder="e.g. TRANSFER"
              value={kind}
              onChange={(e) => {
                setKind(e.target.value);
                handleFilterChange();
              }}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="st">Status</Label>
            <Input
              id="st"
              placeholder="e.g. COMPLETED"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                handleFilterChange();
              }}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="df">Date from</Label>
            <Input
              id="df"
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                handleFilterChange();
              }}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="dt">Date to</Label>
            <Input
              id="dt"
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                handleFilterChange();
              }}
              className="mt-1.5"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="q">Search (this page)</Label>
            <Input
              id="q"
              placeholder="Description, id, type…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-zinc-500">
                <th className="border-b border-white/10 py-2 pr-4 light:border-zinc-200">
                  When
                </th>
                <th className="border-b border-white/10 py-2 pr-4 light:border-zinc-200">
                  Description
                </th>
                <th className="border-b border-white/10 py-2 pr-4 light:border-zinc-200">
                  Type
                </th>
                <th className="border-b border-white/10 py-2 pr-4 light:border-zinc-200">
                  Amount
                </th>
                <th className="border-b border-white/10 py-2 pr-4 light:border-zinc-200">
                  Status
                </th>
                <th className="border-b border-white/10 py-2 light:border-zinc-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="py-2">
                        <Skeleton className="h-8 w-full" />
                      </td>
                    </tr>
                  ))
                : filtered.map((t) => (
                    <tr
                      key={t.id}
                      className="text-zinc-200 light:text-zinc-800"
                    >
                      <td className="border-b border-white/5 py-3 pr-4 text-xs text-zinc-500 light:border-zinc-100">
                        {t.created_at
                          ? new Date(t.created_at).toLocaleString()
                          : "—"}
                      </td>
                      <td className="border-b border-white/5 py-3 pr-4 light:border-zinc-100">
                        {t.description || "—"}
                      </td>
                      <td className="border-b border-white/5 py-3 pr-4 light:border-zinc-100">
                        {t.type ?? "—"}
                      </td>
                      <td className="border-b border-white/5 py-3 pr-4 font-medium light:border-zinc-100">
                        {formatCurrency(t.amount ?? 0)}
                      </td>
                      <td className="border-b border-white/5 py-3 pr-4 light:border-zinc-100">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="border-b border-white/5 py-3 light:border-zinc-100">
                        {isRetryableStatus(t.status) ? (
                          <Button
                            type="button"
                            variant="secondary"
                            className="px-2 py-1 text-xs"
                            disabled={retryMutation.isPending}
                            onClick={async () => {
                              try {
                                await retryMutation.mutateAsync({
                                  id: t.id,
                                  idempotency_key: buildIdempotencyKey("retry"),
                                });
                                toast.success("Retry submitted");
                              } catch (err) {
                                toast.error(getErrorMessage(err));
                              }
                            }}
                          >
                            Retry
                          </Button>
                        ) : (
                          <span className="text-xs text-zinc-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {!isLoading && filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              No transactions on this page
            </p>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-400">
          <span>
            Page {page} of {pageCount} · {total} total (API)
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-lg border border-white/10 px-3 py-1 text-xs font-medium text-zinc-200 transition hover:bg-white/5 disabled:opacity-40 light:border-zinc-200 light:text-zinc-800"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <button
              type="button"
              className="rounded-lg border border-white/10 px-3 py-1 text-xs font-medium text-zinc-200 transition hover:bg-white/5 disabled:opacity-40 light:border-zinc-200 light:text-zinc-800"
              disabled={page >= pageCount}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
