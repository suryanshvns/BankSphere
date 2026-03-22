"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useBeneficiariesQuery,
  useCreateBeneficiaryMutation,
  useDeleteBeneficiaryMutation,
} from "@/hooks/use-beneficiaries";
import { getErrorMessage } from "@/services/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function BeneficiariesPageView() {
  const listQuery = useBeneficiariesQuery();
  const createMutation = useCreateBeneficiaryMutation();
  const deleteMutation = useDeleteBeneficiaryMutation();
  const [displayName, setDisplayName] = useState("Payee");
  const [beneficiaryAccountId, setBeneficiaryAccountId] = useState("");

  useEffect(() => {
    if (listQuery.isError && listQuery.error) {
      toast.error(getErrorMessage(listQuery.error));
    }
  }, [listQuery.isError, listQuery.error]);

  const handleCreate = async () => {
    const id = beneficiaryAccountId.trim();
    if (!id) {
      toast.error("Enter beneficiary account id");
      return;
    }
    try {
      await createMutation.mutateAsync({
        display_name: displayName.trim() || "Payee",
        beneficiary_account_id: id,
      });
      toast.success("Beneficiary added");
      setBeneficiaryAccountId("");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white light:text-zinc-900">
          Payees
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-400 light:text-zinc-600">
          Saved beneficiaries — POST /beneficiaries · GET · DELETE
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
            Add payee
          </p>
          <div className="mt-4 space-y-3">
            <div>
              <Label htmlFor="nm">Display name</Label>
              <Input
                id="nm"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="bid">Beneficiary account ID</Label>
              <Input
                id="bid"
                value={beneficiaryAccountId}
                onChange={(e) => setBeneficiaryAccountId(e.target.value)}
                className="mt-1.5 font-mono text-xs"
                placeholder="Another user's account UUID"
              />
            </div>
            <Button
              type="button"
              disabled={createMutation.isPending}
              onClick={() => void handleCreate()}
            >
              {createMutation.isPending ? "Saving…" : "Save payee"}
            </Button>
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
            Saved
          </p>
          <ul className="mt-4 space-y-2">
            {listQuery.isPending ? (
              <Skeleton className="h-14 w-full" />
            ) : (
              (listQuery.data ?? []).map((b) => (
                <li
                  key={b.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm light:border-zinc-200 light:bg-white/80"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-100 light:text-zinc-900">
                      {b.display_name}
                    </p>
                    <p className="break-all font-mono text-xs text-zinc-500">
                      {b.beneficiary_account_id}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-rose-400 hover:text-rose-300"
                    disabled={deleteMutation.isPending}
                    onClick={async () => {
                      try {
                        await deleteMutation.mutateAsync(b.id);
                        toast.success("Removed");
                      } catch (err) {
                        toast.error(getErrorMessage(err));
                      }
                    }}
                  >
                    Delete
                  </Button>
                </li>
              ))
            )}
            {!listQuery.isPending && (listQuery.data?.length ?? 0) === 0 ? (
              <li className="text-sm text-zinc-500">No payees yet</li>
            ) : null}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
