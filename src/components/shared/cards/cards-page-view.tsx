"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAccountsQuery } from "@/hooks/use-accounts";
import {
  useCancelCardMutation,
  useCardsQuery,
  useCreateCardMutation,
  usePatchCardFreezeMutation,
} from "@/hooks/use-cards";
import {
  useCardAuthorizeMutation,
  useCardCaptureMutation,
  useCardReverseMutation,
} from "@/hooks/use-platform-cards";
import { getErrorMessage } from "@/services/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";

function buildIdempotencyKey(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function pickAuthorizationId(data: Record<string, unknown> | undefined) {
  if (!data) return "";
  const v = data.authorization_id ?? data.id;
  return typeof v === "string" ? v : "";
}

export function CardsPageView() {
  const listQuery = useCardsQuery();
  const accountsQuery = useAccountsQuery();
  const createMutation = useCreateCardMutation();
  const freezeMutation = usePatchCardFreezeMutation();
  const cancelMutation = useCancelCardMutation();
  const authorizeMutation = useCardAuthorizeMutation();
  const captureMutation = useCardCaptureMutation();
  const reverseMutation = useCardReverseMutation();
  const [label, setLabel] = useState("Debit");
  const [last4, setLast4] = useState("4242");

  const cards = listQuery.data ?? [];
  const accounts = accountsQuery.data ?? [];
  const firstCardId = cards[0]?.id ?? "";
  const firstAccId = accounts[0]?.id ?? "";
  const [simCardId, setSimCardId] = useState("");
  const effectiveSimCard =
    simCardId && cards.some((c) => c.id === simCardId) ? simCardId : firstCardId;
  const [authAmount, setAuthAmount] = useState("10.00");
  const [merchantName, setMerchantName] = useState("Store");
  const [authorizationId, setAuthorizationId] = useState("");
  const [capFromAccount, setCapFromAccount] = useState("");
  const effectiveCapFrom =
    capFromAccount && accounts.some((a) => a.id === capFromAccount)
      ? capFromAccount
      : firstAccId;

  const authResult = authorizeMutation.data as
    | Record<string, unknown>
    | undefined;

  useEffect(() => {
    if (listQuery.isError && listQuery.error) {
      toast.error(getErrorMessage(listQuery.error));
    }
  }, [listQuery.isError, listQuery.error]);

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        label: label.trim(),
        last4: last4.trim().slice(0, 4),
      });
      toast.success("Card added");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white light:text-zinc-900">
          Cards
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-400 light:text-zinc-600">
          Card registry plus platform authorize / capture / reverse (sim)
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
            Register card
          </p>
          <div className="mt-4 space-y-3">
            <div>
              <Label htmlFor="lb">Label</Label>
              <Input
                id="lb"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="l4">Last 4</Label>
              <Input
                id="l4"
                value={last4}
                onChange={(e) =>
                  setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                className="mt-1.5"
                inputMode="numeric"
                maxLength={4}
              />
            </div>
            <Button
              type="button"
              disabled={createMutation.isPending || last4.length !== 4}
              onClick={() => void handleCreate()}
            >
              {createMutation.isPending ? "Adding…" : "Add card"}
            </Button>
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
            Your cards
          </p>
          <ul className="mt-4 space-y-3">
            {listQuery.isPending ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              (listQuery.data ?? []).map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm light:border-zinc-200 light:bg-white/80"
                >
                  <div>
                    <p className="font-medium text-zinc-100 light:text-zinc-900">
                      {c.label ?? "Card"} ·••• {c.last4}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      <StatusBadge status={c.status} />
                      {c.is_frozen ? (
                        <StatusBadge status="FROZEN" />
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="px-2 py-1 text-xs"
                      disabled={freezeMutation.isPending}
                      onClick={async () => {
                        try {
                          await freezeMutation.mutateAsync({
                            cardId: c.id,
                            is_frozen: !c.is_frozen,
                          });
                          toast.success(c.is_frozen ? "Unfrozen" : "Frozen");
                        } catch (err) {
                          toast.error(getErrorMessage(err));
                        }
                      }}
                    >
                      {c.is_frozen ? "Unfreeze" : "Freeze"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="px-2 py-1 text-xs text-rose-400 hover:text-rose-300"
                      disabled={cancelMutation.isPending}
                      onClick={async () => {
                        try {
                          await cancelMutation.mutateAsync(c.id);
                          toast.success("Cancelled");
                        } catch (err) {
                          toast.error(getErrorMessage(err));
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </li>
              ))
            )}
            {!listQuery.isPending && (listQuery.data?.length ?? 0) === 0 ? (
              <li className="text-sm text-zinc-500">No cards</li>
            ) : null}
          </ul>
        </GlassCard>
      </div>

      <GlassCard>
        <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
          Card simulation (authorize → capture / reverse)
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          POST /platform/cards/{"{id}"}/authorize · /capture · …/authorizations/
          {"{id}"}/reverse
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <div>
              <Label htmlFor="sim-card">Card</Label>
              <Select
                id="sim-card"
                className="mt-1.5"
                value={effectiveSimCard}
                onChange={(e) => setSimCardId(e.target.value)}
                disabled={!cards.length}
              >
                {cards.length === 0 ? (
                  <option value="">No cards</option>
                ) : (
                  cards.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label ?? "Card"} ·••• {c.last4}
                    </option>
                  ))
                )}
              </Select>
            </div>
            <div>
              <Label htmlFor="sim-amt">Amount</Label>
              <Input
                id="sim-amt"
                className="mt-1.5"
                inputMode="decimal"
                value={authAmount}
                onChange={(e) => setAuthAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="sim-merch">Merchant</Label>
              <Input
                id="sim-merch"
                className="mt-1.5"
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              disabled={authorizeMutation.isPending || !effectiveSimCard}
              onClick={async () => {
                try {
                  const data = (await authorizeMutation.mutateAsync({
                    cardId: effectiveSimCard,
                    body: {
                      amount: authAmount.trim() || "0",
                      merchant_name: merchantName.trim() || "Merchant",
                      idempotency_key: buildIdempotencyKey("card-auth"),
                    },
                  })) as Record<string, unknown>;
                  const aid = pickAuthorizationId(data);
                  if (aid) setAuthorizationId(aid);
                  toast.success("Authorization created");
                } catch (err) {
                  toast.error(getErrorMessage(err));
                }
              }}
            >
              {authorizeMutation.isPending ? "Authorizing…" : "Authorize"}
            </Button>
            <div>
              <Label htmlFor="auth-id">Authorization ID</Label>
              <Input
                id="auth-id"
                className="mt-1.5 font-mono text-xs"
                value={authorizationId}
                onChange={(e) => setAuthorizationId(e.target.value)}
                placeholder="From response or paste"
              />
            </div>
            <div>
              <Label htmlFor="cap-from">Capture — from account</Label>
              <Select
                id="cap-from"
                className="mt-1.5"
                value={effectiveCapFrom}
                onChange={(e) => setCapFromAccount(e.target.value)}
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
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                disabled={
                  captureMutation.isPending ||
                  !effectiveSimCard ||
                  !authorizationId.trim() ||
                  !effectiveCapFrom
                }
                onClick={async () => {
                  try {
                    await captureMutation.mutateAsync({
                      cardId: effectiveSimCard,
                      body: {
                        authorization_id: authorizationId.trim(),
                        from_account_id: effectiveCapFrom,
                        idempotency_key: buildIdempotencyKey("card-cap"),
                      },
                    });
                    toast.success("Capture posted");
                  } catch (err) {
                    toast.error(getErrorMessage(err));
                  }
                }}
              >
                {captureMutation.isPending ? "Capturing…" : "Capture"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="text-rose-400"
                disabled={
                  reverseMutation.isPending || !authorizationId.trim()
                }
                onClick={async () => {
                  try {
                    await reverseMutation.mutateAsync(authorizationId.trim());
                    toast.success("Reversal posted");
                  } catch (err) {
                    toast.error(getErrorMessage(err));
                  }
                }}
              >
                {reverseMutation.isPending ? "Reversing…" : "Reverse"}
              </Button>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500">Last authorize response</p>
            <pre className="mt-2 max-h-64 overflow-auto rounded-xl border border-white/10 bg-zinc-950/40 p-3 text-[11px] text-zinc-300 light:border-zinc-200 light:bg-zinc-50 light:text-zinc-800">
              {authResult
                ? JSON.stringify(authResult, null, 2)
                : "—"}
            </pre>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
