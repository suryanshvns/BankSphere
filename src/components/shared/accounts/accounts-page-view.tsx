"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  createAccountSchema,
  type CreateAccountFormValues,
} from "@/schemas/account.schema";
import {
  useAccountBalanceQuery,
  useAccountDetailQuery,
  useAccountStatementQuery,
  useAccountsQuery,
  useCreateAccountMutation,
  usePatchAccountNicknameMutation,
} from "@/hooks/use-accounts";
import { getAccountStatementCsvBlob } from "@/services/accounts-extra";
import { getErrorMessage } from "@/services/client";
import { formatCurrency } from "@/utils/money";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/badge";

function AccountNicknameEditor({
  accountId,
  serverNickname,
  onSaved,
}: {
  accountId: string;
  serverNickname?: string | null;
  onSaved: () => void;
}) {
  const [dirty, setDirty] = useState(false);
  const [draft, setDraft] = useState("");
  const nicknameMutation = usePatchAccountNicknameMutation();
  const server = typeof serverNickname === "string" ? serverNickname : "";
  const value = dirty ? draft : server;

  return (
    <GlassCard>
      <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
        Nickname
      </p>
      <p className="mt-1 text-xs text-zinc-500">PATCH /accounts/{"{id}"}</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <Label htmlFor="nick">Display name</Label>
          <Input
            id="nick"
            value={value}
            onChange={(e) => {
              setDirty(true);
              setDraft(e.target.value);
            }}
            className="mt-1.5"
            placeholder="Primary checking"
          />
        </div>
        <Button
          type="button"
          disabled={nicknameMutation.isPending}
          onClick={async () => {
            try {
              await nicknameMutation.mutateAsync({
                accountId,
                nickname: (dirty ? draft : server).trim() || "Account",
              });
              toast.success("Nickname saved");
              setDirty(false);
              setDraft("");
              onSaved();
            } catch (err) {
              toast.error(getErrorMessage(err));
            }
          }}
        >
          {nicknameMutation.isPending ? "Saving…" : "Save"}
        </Button>
      </div>
    </GlassCard>
  );
}

function AccountStatementSection({ accountId }: { accountId: string }) {
  const [stmtPage, setStmtPage] = useState(1);
  const statementQuery = useAccountStatementQuery(accountId, {
    page: stmtPage,
    page_size: 8,
  });

  return (
    <GlassCard>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
            Statement
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            GET /accounts/{"{id}"}/statement
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="text-xs"
          onClick={async () => {
            try {
              const blob = await getAccountStatementCsvBlob(accountId);
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `statement-${accountId.slice(0, 8)}.csv`;
              a.click();
              URL.revokeObjectURL(url);
              toast.success("CSV downloaded");
            } catch (err) {
              toast.error(getErrorMessage(err));
            }
          }}
        >
          Download CSV
        </Button>
      </div>
      <div className="mt-4 overflow-x-auto rounded-xl border border-white/10 light:border-zinc-200">
        {statementQuery.isPending ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <table className="w-full min-w-[480px] text-left text-xs">
            <tbody>
              {(() => {
                const s = statementQuery.data;
                const rows = Array.isArray(s?.items)
                  ? s.items
                  : Array.isArray(s?.transactions)
                    ? s.transactions
                    : [];
                if (rows.length === 0) {
                  return (
                    <tr>
                      <td className="p-4 text-zinc-500">No rows</td>
                    </tr>
                  );
                }
                return rows.slice(0, 12).map((row, i) => (
                  <tr
                    key={i}
                    className="border-t border-white/5 light:border-zinc-100"
                  >
                    <td className="p-2 font-mono text-[10px] text-zinc-400">
                      <pre className="whitespace-pre-wrap break-all">
                        {JSON.stringify(row)}
                      </pre>
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        )}
      </div>
      <div className="mt-3 flex justify-between text-xs text-zinc-500">
        <button
          type="button"
          className="rounded-lg border border-white/10 px-2 py-1 disabled:opacity-40 light:border-zinc-200"
          disabled={stmtPage <= 1}
          onClick={() => setStmtPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span>Page {stmtPage}</span>
        <button
          type="button"
          className="rounded-lg border border-white/10 px-2 py-1 disabled:opacity-40 light:border-zinc-200"
          onClick={() => setStmtPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </GlassCard>
  );
}

export function AccountsPageView() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const accountsQuery = useAccountsQuery();
  const accounts = accountsQuery.data;
  const activeAccountId =
    selectedId && accounts?.some((a) => a.id === selectedId)
      ? selectedId
      : accounts?.[0]?.id ?? null;
  const detailQuery = useAccountDetailQuery(activeAccountId);
  const balanceQuery = useAccountBalanceQuery(activeAccountId);
  const createMutation = useCreateAccountMutation();

  const form = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: { type: "SAVINGS", currency: "USD" },
  });

  useEffect(() => {
    if (accountsQuery.isError && accountsQuery.error) {
      toast.error(getErrorMessage(accountsQuery.error));
    }
  }, [accountsQuery.isError, accountsQuery.error]);

  const handleSelectAccount = (id: string) => {
    setSelectedId(id);
  };

  const handleCreateSubmit = form.handleSubmit(async (values) => {
    try {
      await createMutation.mutateAsync({
        type: values.type,
        currency: values.currency,
      });
      toast.success("Account created");
      void accountsQuery.refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  });

  const isLoading = accountsQuery.isPending;
  const detail = detailQuery.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white light:text-zinc-900">
          Accounts
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-400 light:text-zinc-600">
          Balances and account details from the API
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
            Your accounts
          </p>
          <div className="mt-4 space-y-2">
            {isLoading ? (
              <>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </>
            ) : (
              (accounts ?? []).map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleSelectAccount(acc.id)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition light:border-zinc-200 light:bg-white/80 ${
                    acc.id === activeAccountId
                      ? "border-cyan-500/40 bg-white/10"
                      : "border-white/10 bg-white/5 hover:border-cyan-500/30"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-white light:text-zinc-900">
                      {acc.nickname ? `${acc.nickname} · ` : ""}
                      {acc.type} · {acc.currency}
                    </p>
                    <p className="text-xs text-zinc-500">{acc.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-cyan-300 light:text-violet-700">
                      {formatCurrency(acc.balance ?? 0, acc.currency)}
                    </p>
                    <StatusBadge status={acc.status} />
                  </div>
                </button>
              ))
            )}
            {!isLoading && (accounts?.length ?? 0) === 0 ? (
              <p className="text-sm text-zinc-500">No accounts yet</p>
            ) : null}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
            Open account
          </p>
          <form className="mt-4 space-y-3" onSubmit={handleCreateSubmit}>
            <div>
              <Label htmlFor="type">Type</Label>
              <Controller
                name="type"
                control={form.control}
                render={({ field }) => (
                  <Select
                    {...field}
                    id="type"
                    className="mt-1.5"
                  >
                    <option value="SAVINGS">Savings</option>
                    <option value="CHECKING">Checking</option>
                    <option value="CURRENT">Current</option>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Controller
                name="currency"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      id="currency"
                      className="mt-1.5"
                      maxLength={8}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error ? (
                      <p className="mt-1 text-xs text-rose-400">
                        {fieldState.error.message}
                      </p>
                    ) : null}
                  </>
                )}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Creating…" : "Create via API"}
            </Button>
          </form>
        </GlassCard>
      </div>

      <GlassCard>
        <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
          Account details
        </p>
        {detailQuery.isPending && activeAccountId ? (
          <Skeleton className="mt-4 h-24 w-full" />
        ) : detail ? (
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-zinc-500">ID</dt>
              <dd className="font-mono text-sm text-zinc-200 light:text-zinc-800">
                {detail.id}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-zinc-500">Type</dt>
              <dd className="text-sm text-zinc-200 light:text-zinc-800">
                {detail.type}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-zinc-500">Currency</dt>
              <dd className="text-sm text-zinc-200 light:text-zinc-800">
                {detail.currency}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-zinc-500">Balance</dt>
              <dd className="text-sm font-semibold text-cyan-300 light:text-violet-700">
                {formatCurrency(detail.balance ?? 0, detail.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-zinc-500">Status</dt>
              <dd>
                <StatusBadge status={detail.status} />
              </dd>
            </div>
            {detail.created_at ? (
              <div>
                <dt className="text-xs uppercase text-zinc-500">Opened</dt>
                <dd className="text-sm text-zinc-200 light:text-zinc-800">
                  {new Date(detail.created_at).toLocaleString()}
                </dd>
              </div>
            ) : null}
          </dl>
        ) : (
          <p className="mt-4 text-sm text-zinc-500">
            Select an account to load `/accounts/:id`
          </p>
        )}
      </GlassCard>

      {activeAccountId ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
              Live balance
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              GET /accounts/{"{id}"}/balance
            </p>
            {balanceQuery.isPending ? (
              <Skeleton className="mt-4 h-10 w-40" />
            ) : balanceQuery.data ? (
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-zinc-500">Balance</dt>
                  <dd className="font-semibold text-cyan-300 light:text-violet-700">
                    {formatCurrency(
                      balanceQuery.data.balance ?? 0,
                      balanceQuery.data.currency ?? detail?.currency
                    )}
                  </dd>
                </div>
                {balanceQuery.data.available != null ? (
                  <div className="flex justify-between gap-2">
                    <dt className="text-zinc-500">Available</dt>
                    <dd className="text-zinc-200 light:text-zinc-800">
                      {formatCurrency(
                        String(balanceQuery.data.available),
                        balanceQuery.data.currency ?? detail?.currency
                      )}
                    </dd>
                  </div>
                ) : null}
              </dl>
            ) : (
              <p className="mt-4 text-sm text-zinc-500">No balance data</p>
            )}
          </GlassCard>

          <AccountNicknameEditor
            key={activeAccountId}
            accountId={activeAccountId}
            serverNickname={detail?.nickname}
            onSaved={() => {
              void detailQuery.refetch();
              void accountsQuery.refetch();
            }}
          />
        </div>
      ) : null}

      {activeAccountId ? (
        <AccountStatementSection
          key={activeAccountId}
          accountId={activeAccountId}
        />
      ) : null}
    </div>
  );
}
