"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAccountsQuery } from "@/hooks/use-accounts";
import {
  useCreateRecurringPaymentMutation,
  useRecurringPaymentsQuery,
  useSetRecurringActiveMutation,
} from "@/hooks/use-recurring-payments";
import { getErrorMessage } from "@/services/client";
import { formatCurrency } from "@/utils/money";
import { GlassCard } from "@/components/ui/glass-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/badge";

export function RecurringPaymentsPageView() {
  const accountsQuery = useAccountsQuery();
  const listQuery = useRecurringPaymentsQuery();
  const createMutation = useCreateRecurringPaymentMutation();
  const activeMutation = useSetRecurringActiveMutation();

  const list = useMemo(
    () => accountsQuery.data ?? [],
    [accountsQuery.data]
  );
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("10.00");
  const [frequency, setFrequency] = useState("MONTHLY");
  const [nextRun, setNextRun] = useState("2026-04-01T00:00:00.000Z");

  const first = list[0]?.id ?? "";
  const from = fromId && list.some((a) => a.id === fromId) ? fromId : first;
  const recipients = useMemo(
    () => list.filter((a) => a.id !== from),
    [list, from]
  );
  const to =
    toId && recipients.some((a) => a.id === toId)
      ? toId
      : recipients[0]?.id ?? "";

  useEffect(() => {
    if (listQuery.isError && listQuery.error) {
      toast.error(getErrorMessage(listQuery.error));
    }
  }, [listQuery.isError, listQuery.error]);

  const handleCreate = async () => {
    if (!from || !to || from === to) {
      toast.error("Pick two different accounts");
      return;
    }
    try {
      await createMutation.mutateAsync({
        from_account_id: from,
        to_account_id: to,
        amount,
        frequency,
        next_run_at: nextRun,
      });
      toast.success("Recurring payment created");
      void listQuery.refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white light:text-zinc-900">
          Recurring payments
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-400 light:text-zinc-600">
          POST /recurring-payments · GET list · PATCH …/active
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
            New schedule
          </p>
          {accountsQuery.isPending ? (
            <Skeleton className="mt-4 h-24 w-full" />
          ) : (
            <div className="mt-4 space-y-3">
              <div>
                <Label htmlFor="from">From</Label>
                <Select
                  id="from"
                  className="mt-1.5"
                  value={from}
                  onChange={(e) => setFromId(e.target.value)}
                >
                  {list.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.type} · {a.currency}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="to">To</Label>
                <Select
                  id="to"
                  className="mt-1.5"
                  value={to}
                  onChange={(e) => setToId(e.target.value)}
                  disabled={recipients.length === 0}
                >
                  {recipients.length === 0 ? (
                    <option value="">Need another account</option>
                  ) : (
                    recipients.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.type} · {a.currency}
                      </option>
                    ))
                  )}
                </Select>
              </div>
              <div>
                <Label htmlFor="amt">Amount</Label>
                <Input
                  id="amt"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1.5"
                  inputMode="decimal"
                />
              </div>
              <div>
                <Label htmlFor="freq">Frequency</Label>
                <Select
                  id="freq"
                  className="mt-1.5"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option value="MONTHLY">MONTHLY</option>
                  <option value="WEEKLY">WEEKLY</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="nr">Next run (ISO)</Label>
                <Input
                  id="nr"
                  value={nextRun}
                  onChange={(e) => setNextRun(e.target.value)}
                  className="mt-1.5 font-mono text-xs"
                />
              </div>
              <Button
                type="button"
                disabled={createMutation.isPending || list.length < 2}
                onClick={() => void handleCreate()}
              >
                {createMutation.isPending ? "Creating…" : "Create"}
              </Button>
            </div>
          )}
        </GlassCard>

        <GlassCard>
          <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
            Your schedules
          </p>
          <ul className="mt-4 space-y-3">
            {listQuery.isPending ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              (listQuery.data ?? []).map((r) => (
                <li
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm light:border-zinc-200 light:bg-white/80"
                >
                  <div>
                    <p className="font-medium text-zinc-100 light:text-zinc-900">
                      {formatCurrency(r.amount)} · {r.frequency}
                    </p>
                    <p className="text-xs text-zinc-500">
                      Next {r.next_run_at ?? "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      status={r.active === false ? "PAUSED" : "ACTIVE"}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      className="px-2 py-1 text-xs"
                      disabled={activeMutation.isPending}
                      onClick={async () => {
                        try {
                          const nextActive = r.active === false;
                          await activeMutation.mutateAsync({
                            id: r.id,
                            active: nextActive,
                          });
                          toast.success("Updated");
                        } catch (err) {
                          toast.error(getErrorMessage(err));
                        }
                      }}
                    >
                      {r.active === false ? "Resume" : "Pause"}
                    </Button>
                  </div>
                </li>
              ))
            )}
            {!listQuery.isPending && (listQuery.data?.length ?? 0) === 0 ? (
              <li className="text-sm text-zinc-500">No recurring payments</li>
            ) : null}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
