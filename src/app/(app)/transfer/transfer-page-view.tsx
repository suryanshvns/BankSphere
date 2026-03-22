"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAccountsQuery } from "@/hooks/use-accounts";
import {
  useCreateOutboundPaymentMutation,
  useOutboundPaymentsQuery,
} from "@/hooks/use-platform-payments";
import {
  useDepositMutation,
  useTransferMutation,
  useWithdrawMutation,
} from "@/hooks/use-transaction-mutations";
import type { OutboundPaymentRail } from "@/services/platform-payments";
import { getErrorMessage } from "@/services/client";
import { parseDecimalInput } from "@/utils/money";
import { GlassCard } from "@/components/ui/glass-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";

type TransferMode = "transfer" | "deposit" | "withdraw";

function buildIdempotencyKey(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const OUTBOUND_RAILS: { value: OutboundPaymentRail; label: string }[] = [
  { value: "ACH_SIM", label: "ACH (sim)" },
  { value: "WIRE_SIM", label: "Wire (sim)" },
  { value: "RTP_SIM", label: "RTP (sim)" },
];

export function TransferPageView() {
  const accountsQuery = useAccountsQuery();
  const transferMutation = useTransferMutation();
  const depositMutation = useDepositMutation();
  const withdrawMutation = useWithdrawMutation();
  const outboundQuery = useOutboundPaymentsQuery();
  const outboundMutation = useCreateOutboundPaymentMutation();

  const [mode, setMode] = useState<TransferMode>("transfer");
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [clientReference, setClientReference] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [obFrom, setObFrom] = useState("");
  const [obAmount, setObAmount] = useState("");
  const [obRail, setObRail] = useState<OutboundPaymentRail>("ACH_SIM");
  const [obCpName, setObCpName] = useState("Merchant");
  const [obCpLast4, setObCpLast4] = useState("1234");
  const [obReference, setObReference] = useState("");

  const list = useMemo(
    () => accountsQuery.data ?? [],
    [accountsQuery.data]
  );
  const firstId = list[0]?.id ?? "";
  const isLoading = accountsQuery.isPending;

  const effectiveFrom =
    fromId && list.some((a) => a.id === fromId) ? fromId : firstId;
  const effectiveAccount =
    accountId && list.some((a) => a.id === accountId) ? accountId : firstId;

  const recipientOptions = useMemo(
    () => list.filter((a) => a.id !== effectiveFrom),
    [list, effectiveFrom]
  );

  const effectiveTo = useMemo(() => {
    if (toId && recipientOptions.some((r) => r.id === toId)) return toId;
    return recipientOptions[0]?.id ?? effectiveFrom;
  }, [toId, recipientOptions, effectiveFrom]);

  const effectiveObFrom =
    obFrom && list.some((a) => a.id === obFrom) ? obFrom : firstId;

  useEffect(() => {
    if (accountsQuery.isError && accountsQuery.error) {
      toast.error(getErrorMessage(accountsQuery.error));
    }
  }, [accountsQuery.isError, accountsQuery.error]);

  useEffect(() => {
    if (outboundQuery.isError && outboundQuery.error) {
      toast.error(getErrorMessage(outboundQuery.error));
    }
  }, [outboundQuery.isError, outboundQuery.error]);

  const isSubmitting =
    transferMutation.isPending ||
    depositMutation.isPending ||
    withdrawMutation.isPending;

  const handleOpenConfirm = () => {
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
  };

  const handleConfirmMovement = async () => {
    const amt = parseDecimalInput(amount);
    if (!amt) {
      toast.error("Enter a valid amount");
      return;
    }
    try {
      if (mode === "transfer") {
        if (
          !effectiveFrom ||
          !effectiveTo ||
          effectiveFrom === effectiveTo
        ) {
          toast.error("Choose two different accounts");
          return;
        }
        await transferMutation.mutateAsync({
          from_account_id: effectiveFrom,
          to_account_id: effectiveTo,
          amount: amt,
          idempotency_key: buildIdempotencyKey("ui-tf"),
          description: note || undefined,
          client_reference: clientReference.trim() || undefined,
        });
        toast.success("Transfer completed");
      } else if (mode === "deposit") {
        await depositMutation.mutateAsync({
          account_id: effectiveAccount,
          amount: amt,
          idempotency_key: buildIdempotencyKey("ui-dep"),
          description: note || undefined,
          client_reference: clientReference.trim() || undefined,
        });
        toast.success("Deposit submitted");
      } else {
        await withdrawMutation.mutateAsync({
          account_id: effectiveAccount,
          amount: amt,
          idempotency_key: buildIdempotencyKey("ui-wd"),
          description: note || undefined,
          client_reference: clientReference.trim() || undefined,
        });
        toast.success("Withdrawal submitted");
      }
      handleCloseConfirm();
      setAmount("");
      setNote("");
      setClientReference("");
      void accountsQuery.refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleFromChange = (id: string) => {
    setFromId(id);
    const others = list.filter((a) => a.id !== id);
    if (!others.some((o) => o.id === toId)) {
      setToId(others[0]?.id ?? id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white light:text-zinc-900">
          Move money
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-400 light:text-zinc-600">
          Internal transfer, deposit, withdraw, and simulated outbound rails
        </p>
      </div>

      <GlassCard>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["transfer", "Transfer"],
              ["deposit", "Add money"],
              ["withdraw", "Withdraw"],
            ] as const
          ).map(([m, label]) => (
            <Button
              key={m}
              type="button"
              variant={mode === m ? "primary" : "secondary"}
              className="py-2"
              onClick={() => setMode(m)}
            >
              {label}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="mt-6 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {mode === "transfer" ? (
              <>
                <div>
                  <Label htmlFor="from">From account</Label>
                  <Select
                    id="from"
                    className="mt-1.5"
                    value={effectiveFrom}
                    onChange={(e) => handleFromChange(e.target.value)}
                  >
                    {list.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.type} ({a.currency}) — {a.id.slice(0, 8)}…
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="to">Recipient account</Label>
                  <Select
                    id="to"
                    className="mt-1.5"
                    value={effectiveTo}
                    onChange={(e) => setToId(e.target.value)}
                  >
                    {recipientOptions.length === 0 ? (
                      <option value="">Add another account to transfer</option>
                    ) : (
                      recipientOptions.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.type} ({a.currency}) — {a.id.slice(0, 8)}…
                        </option>
                      ))
                    )}
                  </Select>
                </div>
              </>
            ) : (
              <div>
                <Label htmlFor="acc">Account</Label>
                <Select
                  id="acc"
                  className="mt-1.5"
                  value={effectiveAccount}
                  onChange={(e) => setAccountId(e.target.value)}
                >
                  {list.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.type} ({a.currency})
                    </option>
                  ))}
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="amt">Amount</Label>
              <Input
                id="amt"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="note">Note (optional)</Label>
              <Input
                id="note"
                placeholder="Rent, savings, …"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="cref">Client reference (optional)</Label>
              <Input
                id="cref"
                placeholder="REF-001"
                value={clientReference}
                onChange={(e) => setClientReference(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <Button
              type="button"
              className="w-full sm:w-auto"
              onClick={handleOpenConfirm}
            >
              Review & confirm
            </Button>
          </div>
        )}
      </GlassCard>

      <Modal
        open={isConfirmOpen}
        onClose={handleCloseConfirm}
        title="Confirm movement"
        description="This will call the live BankSphere transaction API."
        confirmLabel="Confirm"
        onConfirm={() => void handleConfirmMovement()}
        loading={isSubmitting}
      >
        <ul className="space-y-1 text-sm text-zinc-300 light:text-zinc-700">
          <li>
            <span className="text-zinc-500">Mode:</span> {mode}
          </li>
          <li>
            <span className="text-zinc-500">Amount:</span>{" "}
            {parseDecimalInput(amount) || amount || "—"}
          </li>
          {mode === "transfer" ? (
            <>
              <li className="break-all">
                <span className="text-zinc-500">From:</span> {effectiveFrom}
              </li>
              <li className="break-all">
                <span className="text-zinc-500">To:</span> {effectiveTo}
              </li>
            </>
          ) : (
            <li className="break-all">
              <span className="text-zinc-500">Account:</span> {effectiveAccount}
            </li>
          )}
        </ul>
      </Modal>

      <GlassCard>
        <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
          Outbound payments (sim rails)
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          POST /platform/payments/outbound · GET list
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <div>
              <Label htmlFor="ob-from">From account</Label>
              <Select
                id="ob-from"
                className="mt-1.5"
                value={effectiveObFrom}
                onChange={(e) => setObFrom(e.target.value)}
                disabled={!list.length}
              >
                {list.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.type} ({a.currency})
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="ob-amt">Amount</Label>
              <Input
                id="ob-amt"
                inputMode="decimal"
                className="mt-1.5"
                value={obAmount}
                onChange={(e) => setObAmount(e.target.value)}
                placeholder="25.00"
              />
            </div>
            <div>
              <Label htmlFor="ob-rail">Rail</Label>
              <Select
                id="ob-rail"
                className="mt-1.5"
                value={obRail}
                onChange={(e) =>
                  setObRail(e.target.value as OutboundPaymentRail)
                }
              >
                {OUTBOUND_RAILS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="ob-cp">Counterparty name</Label>
              <Input
                id="ob-cp"
                className="mt-1.5"
                value={obCpName}
                onChange={(e) => setObCpName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ob-l4">Account last 4</Label>
              <Input
                id="ob-l4"
                className="mt-1.5"
                inputMode="numeric"
                maxLength={4}
                value={obCpLast4}
                onChange={(e) =>
                  setObCpLast4(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
              />
            </div>
            <div>
              <Label htmlFor="ob-ref">Reference (optional)</Label>
              <Input
                id="ob-ref"
                className="mt-1.5"
                value={obReference}
                onChange={(e) => setObReference(e.target.value)}
                placeholder="INV-001"
              />
            </div>
            <Button
              type="button"
              disabled={
                outboundMutation.isPending ||
                !effectiveObFrom ||
                !parseDecimalInput(obAmount)
              }
              onClick={async () => {
                const amt = parseDecimalInput(obAmount);
                if (!amt) {
                  toast.error("Enter a valid amount");
                  return;
                }
                try {
                  await outboundMutation.mutateAsync({
                    from_account_id: effectiveObFrom,
                    amount: amt,
                    rail: obRail,
                    idempotency_key: buildIdempotencyKey("ob-pay"),
                    counterparty: {
                      name: obCpName.trim() || "Counterparty",
                      account_last4: obCpLast4.trim() || undefined,
                    },
                    reference: obReference.trim() || undefined,
                  });
                  toast.success("Outbound payment submitted");
                  void outboundQuery.refetch();
                } catch (err) {
                  toast.error(getErrorMessage(err));
                }
              }}
            >
              {outboundMutation.isPending ? "Sending…" : "Send outbound"}
            </Button>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500">Recent / list</p>
            <ul className="mt-2 max-h-72 space-y-2 overflow-auto text-xs">
              {outboundQuery.isPending ? (
                <Skeleton className="h-12 w-full" />
              ) : (
                (outboundQuery.data ?? []).map((p, i) => (
                  <li
                    key={String(p.id ?? i)}
                    className="rounded-lg border border-white/10 bg-white/5 p-2 font-mono light:border-zinc-200 light:bg-white/80"
                  >
                    <pre className="whitespace-pre-wrap break-all">
                      {JSON.stringify(p)}
                    </pre>
                  </li>
                ))
              )}
              {!outboundQuery.isPending &&
              (outboundQuery.data?.length ?? 0) === 0 ? (
                <li className="text-sm text-zinc-500">No outbound rows</li>
              ) : null}
            </ul>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
