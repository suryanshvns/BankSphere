"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  loanApplySchema,
  type LoanApplyFormValues,
} from "@/schemas/loan.schema";
import { useAccountsQuery } from "@/hooks/use-accounts";
import { useApplyLoanMutation, useLoansQuery } from "@/hooks/use-loans";
import {
  useLoanInstallmentsQuery,
  useLoanProductsQuery,
  useLoanScheduleQuery,
  usePayLoanInstallmentMutation,
  usePrepayLoanMutation,
} from "@/hooks/use-loans-extra";
import { getErrorMessage } from "@/services/client";
import { computeMonthlyEmi } from "@/utils/emi";
import { formatCurrency } from "@/utils/money";
import { GlassCard } from "@/components/ui/glass-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/badge";

const loanDefaults: LoanApplyFormValues = {
  purpose: "Education",
  principal: "25000",
  annualRatePct: "11.5",
  tenureMonths: "48",
};

export function LoansPageView() {
  const loansQuery = useLoansQuery();
  const loans = loansQuery.data;
  const accountsQuery = useAccountsQuery();
  const productsQuery = useLoanProductsQuery();
  const applyMutation = useApplyLoanMutation();
  const prepayMutation = usePrepayLoanMutation();
  const payInstallmentMutation = usePayLoanInstallmentMutation();
  const [schedulePick, setSchedulePick] = useState<string | null>(null);
  const [prepayAmount, setPrepayAmount] = useState("50.00");
  const [payFromAccountId, setPayFromAccountId] = useState("");
  const firstLoanId = loans?.[0]?.id ?? "";
  const scheduleLoanId =
    schedulePick && loans?.some((l) => l.id === schedulePick)
      ? schedulePick
      : firstLoanId;
  const scheduleQuery = useLoanScheduleQuery(scheduleLoanId || null);
  const installmentsQuery = useLoanInstallmentsQuery(scheduleLoanId || null);

  const form = useForm<LoanApplyFormValues>({
    resolver: zodResolver(loanApplySchema),
    defaultValues: loanDefaults,
    mode: "onBlur",
  });

  const principal = useWatch({ control: form.control, name: "principal" });
  const annualRatePct = useWatch({
    control: form.control,
    name: "annualRatePct",
  });
  const tenureMonths = useWatch({
    control: form.control,
    name: "tenureMonths",
  });

  useEffect(() => {
    if (loansQuery.isError && loansQuery.error) {
      toast.error(getErrorMessage(loansQuery.error));
    }
  }, [loansQuery.isError, loansQuery.error]);

  useEffect(() => {
    if (productsQuery.isError && productsQuery.error) {
      toast.error(getErrorMessage(productsQuery.error));
    }
  }, [productsQuery.isError, productsQuery.error]);

  useEffect(() => {
    if (scheduleQuery.isError && scheduleQuery.error) {
      toast.error(getErrorMessage(scheduleQuery.error));
    }
  }, [scheduleQuery.isError, scheduleQuery.error]);

  useEffect(() => {
    if (installmentsQuery.isError && installmentsQuery.error) {
      toast.error(getErrorMessage(installmentsQuery.error));
    }
  }, [installmentsQuery.isError, installmentsQuery.error]);

  const accounts = accountsQuery.data ?? [];
  const firstAccountId = accounts[0]?.id ?? "";
  const effectivePayFrom =
    payFromAccountId && accounts.some((a) => a.id === payFromAccountId)
      ? payFromAccountId
      : firstAccountId;

  const preview = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(annualRatePct);
    const m = parseInt(String(tenureMonths), 10);
    if (Number.isNaN(p) || Number.isNaN(r) || Number.isNaN(m) || m < 1) return null;
    const emi = computeMonthlyEmi(p, r, m);
    const total = emi * m;
    return { emi, total };
  }, [principal, annualRatePct, tenureMonths]);

  const handleApplySubmit = form.handleSubmit(async (values) => {
    try {
      await applyMutation.mutateAsync({
        principal: parseFloat(values.principal).toFixed(2),
        annual_rate_pct: parseFloat(values.annualRatePct).toFixed(2),
        tenure_months: parseInt(values.tenureMonths, 10),
        purpose: values.purpose.trim() || "General",
      });
      toast.success("Application submitted");
      void loansQuery.refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  });

  const isLoading = loansQuery.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white light:text-zinc-900">
          Loans
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-400 light:text-zinc-600">
          Apply, estimate EMI, and track status from the API
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
            EMI calculator
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Reducing-balance estimate (same inputs as `/loans/apply`)
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="p">Principal</Label>
              <Controller
                name="principal"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      id="p"
                      inputMode="decimal"
                      className="mt-1.5"
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
            <div>
              <Label htmlFor="r">Annual rate %</Label>
              <Controller
                name="annualRatePct"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      id="r"
                      inputMode="decimal"
                      className="mt-1.5"
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
            <div>
              <Label htmlFor="m">Tenure (months)</Label>
              <Controller
                name="tenureMonths"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      id="m"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      className="mt-1.5"
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
          </div>
          {preview ? (
            <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
              <p className="text-xs uppercase text-cyan-200/80">
                Estimated monthly EMI
              </p>
              <p className="mt-1 text-2xl font-semibold text-white light:text-zinc-900">
                {formatCurrency(preview.emi)}
              </p>
              <p className="mt-2 text-xs text-zinc-400">
                Total payable ≈ {formatCurrency(preview.total)} over{" "}
                {tenureMonths} months
              </p>
            </div>
          ) : null}
        </GlassCard>

        <GlassCard>
          <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
            Apply for loan
          </p>
          <form className="mt-4 space-y-3" onSubmit={handleApplySubmit}>
            <div>
              <Label htmlFor="purpose">Purpose</Label>
              <Controller
                name="purpose"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      id="purpose"
                      className="mt-1.5"
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
              disabled={applyMutation.isPending}
            >
              {applyMutation.isPending ? "Submitting…" : "POST /loans/apply"}
            </Button>
          </form>
        </GlassCard>
      </div>

      <GlassCard>
        <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
          Loan status
        </p>
        <div className="mt-4 space-y-3">
          {isLoading ? (
            <>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </>
          ) : (
            (loans ?? []).map((loan) => (
              <div
                key={loan.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 light:border-zinc-200 light:bg-white/80"
              >
                <div>
                  <p className="text-sm font-medium text-white light:text-zinc-900">
                    {loan.purpose ?? "Loan"} · {loan.tenure_months ?? "—"} mo
                  </p>
                  <p className="text-xs text-zinc-500">
                    Principal {formatCurrency(loan.principal ?? 0)} @{" "}
                    {loan.annual_rate_pct ?? "—"}% APR
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={loan.status} />
                  {loan.monthly_emi ? (
                    <span className="text-xs text-zinc-400">
                      EMI {formatCurrency(loan.monthly_emi)}
                    </span>
                  ) : null}
                </div>
              </div>
            ))
          )}
          {!isLoading && (loans?.length ?? 0) === 0 ? (
            <p className="text-sm text-zinc-500">No loans yet</p>
          ) : null}
        </div>
      </GlassCard>

      <GlassCard>
        <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
          Loan products
        </p>
        <p className="mt-1 text-xs text-zinc-500">GET /loans/products</p>
        <ul className="mt-4 space-y-2">
          {productsQuery.isPending ? (
            <Skeleton className="h-12 w-full" />
          ) : (
            (productsQuery.data ?? []).map((p, i) => (
              <li
                key={String(p.id ?? p.code ?? i)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300 light:border-zinc-200 light:bg-white/80 light:text-zinc-800"
              >
                <pre className="whitespace-pre-wrap break-all font-mono">
                  {JSON.stringify(p)}
                </pre>
              </li>
            ))
          )}
          {!productsQuery.isPending &&
          (productsQuery.data?.length ?? 0) === 0 ? (
            <li className="text-sm text-zinc-500">No catalog rows</li>
          ) : null}
        </ul>
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
            Repayment schedule
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            GET /loans/{"{id}"}/schedule
          </p>
          <div className="mt-3">
            <Label htmlFor="loanPick">Loan</Label>
            <Select
              id="loanPick"
              className="mt-1.5"
              value={scheduleLoanId}
              onChange={(e) =>
                setSchedulePick(e.target.value ? e.target.value : null)
              }
              disabled={!(loans ?? []).length}
            >
              {(loans ?? []).length === 0 ? (
                <option value="">No loans yet</option>
              ) : (
                (loans ?? []).map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.purpose ?? l.id.slice(0, 8)}
                  </option>
                ))
              )}
            </Select>
          </div>
          <div className="mt-4 max-h-64 overflow-auto rounded-xl border border-white/10 light:border-zinc-200">
            {scheduleQuery.isPending ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-zinc-900/90 text-zinc-500 light:bg-white">
                  <tr>
                    <th className="p-2">#</th>
                    <th className="p-2">Due</th>
                    <th className="p-2">EMI</th>
                  </tr>
                </thead>
                <tbody>
                  {(scheduleQuery.data ?? []).map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-white/5 light:border-zinc-100"
                    >
                      <td className="p-2">{row.installment_no ?? idx + 1}</td>
                      <td className="p-2">{row.due_date ?? "—"}</td>
                      <td className="p-2">{row.emi ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!scheduleQuery.isPending &&
            (scheduleQuery.data?.length ?? 0) === 0 ? (
              <p className="p-4 text-sm text-zinc-500">No schedule rows</p>
            ) : null}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
            Prepay
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            POST /loans/{"{id}"}/prepay
          </p>
          <div className="mt-4 space-y-3">
            <div>
              <Label htmlFor="pam">Amount</Label>
              <Input
                id="pam"
                value={prepayAmount}
                onChange={(e) => setPrepayAmount(e.target.value)}
                className="mt-1.5"
                inputMode="decimal"
              />
            </div>
            <Button
              type="button"
              disabled={
                prepayMutation.isPending ||
                !scheduleLoanId ||
                !parseFloat(prepayAmount)
              }
              onClick={async () => {
                try {
                  await prepayMutation.mutateAsync({
                    loanId: scheduleLoanId,
                    amount: parseFloat(prepayAmount).toFixed(2),
                  });
                  toast.success("Prepay submitted");
                  void scheduleQuery.refetch();
                  void loansQuery.refetch();
                } catch (err) {
                  toast.error(getErrorMessage(err));
                }
              }}
            >
              {prepayMutation.isPending ? "Posting…" : "Prepay"}
            </Button>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
          Installments (ledger rows)
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          GET /loans/{"{id}"}/installments · POST …/{"{n}"}/pay
        </p>
        <p className="mt-2 text-xs text-zinc-500">
          Uses the same loan as the schedule picker above.
        </p>
        <div className="mt-4">
          <Label htmlFor="inst-pay-from">Pay from account</Label>
          <Select
            id="inst-pay-from"
            className="mt-1.5"
            value={effectivePayFrom}
            onChange={(e) => setPayFromAccountId(e.target.value)}
            disabled={!accounts.length}
          >
            {accounts.length === 0 ? (
              <option value="">No accounts</option>
            ) : (
              accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.type} ({a.currency})
                </option>
              ))
            )}
          </Select>
        </div>
        <div className="mt-4 max-h-72 overflow-auto rounded-xl border border-white/10 light:border-zinc-200">
          {installmentsQuery.isPending ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-zinc-900/90 text-zinc-500 light:bg-white">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Due</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Status</th>
                  <th className="p-2 w-24" />
                </tr>
              </thead>
              <tbody>
                {(installmentsQuery.data ?? []).map((row, idx) => {
                  const n = row.installment_no ?? idx + 1;
                  return (
                    <tr
                      key={`${n}-${idx}`}
                      className="border-t border-white/5 light:border-zinc-100"
                    >
                      <td className="p-2">{n}</td>
                      <td className="p-2">{row.due_date ?? "—"}</td>
                      <td className="p-2">
                        {String(
                          row.amount ?? row.emi ?? row.principal ?? "—"
                        )}
                      </td>
                      <td className="p-2">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="p-2">
                        <Button
                          type="button"
                          variant="secondary"
                          className="px-2 py-1 text-[10px]"
                          disabled={
                            payInstallmentMutation.isPending ||
                            !scheduleLoanId ||
                            !effectivePayFrom
                          }
                          onClick={async () => {
                            try {
                              await payInstallmentMutation.mutateAsync({
                                loanId: scheduleLoanId,
                                installmentNo: n,
                                from_account_id: effectivePayFrom,
                              });
                              toast.success(`Installment ${n} paid`);
                            } catch (err) {
                              toast.error(getErrorMessage(err));
                            }
                          }}
                        >
                          Pay
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {!installmentsQuery.isPending &&
          (installmentsQuery.data?.length ?? 0) === 0 ? (
            <p className="p-4 text-sm text-zinc-500">
              No installment rows (approved loans only)
            </p>
          ) : null}
        </div>
      </GlassCard>
    </div>
  );
}
