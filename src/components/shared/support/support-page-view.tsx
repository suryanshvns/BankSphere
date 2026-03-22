"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useCreateSupportCaseMutation,
  useSupportCasesQuery,
} from "@/hooks/use-platform-support";
import { getErrorMessage } from "@/services/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/badge";

export function SupportPageView() {
  const listQuery = useSupportCasesQuery();
  const createMutation = useCreateSupportCaseMutation();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState("1");

  useEffect(() => {
    if (listQuery.isError && listQuery.error) {
      toast.error(getErrorMessage(listQuery.error));
    }
  }, [listQuery.isError, listQuery.error]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white light:text-zinc-900">
          Support
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-400 light:text-zinc-600">
          Open and track cases via /platform/support/cases
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
            New case
          </p>
          <div className="mt-4 space-y-3">
            <div>
              <Label htmlFor="sup-subj">Subject</Label>
              <Input
                id="sup-subj"
                className="mt-1.5"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="sup-body">Details</Label>
              <textarea
                id="sup-body"
                className="mt-1.5 min-h-[120px] w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none ring-cyan-500/40 placeholder:text-zinc-500 focus-visible:ring-2 light:border-zinc-200 light:bg-white light:text-zinc-900"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="sup-pri">Priority (number)</Label>
              <Input
                id="sup-pri"
                type="number"
                inputMode="numeric"
                className="mt-1.5"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              />
            </div>
            <Button
              type="button"
              disabled={
                createMutation.isPending || !subject.trim() || !body.trim()
              }
              onClick={async () => {
                try {
                  await createMutation.mutateAsync({
                    subject: subject.trim(),
                    body: body.trim(),
                    priority: parseInt(priority, 10) || 1,
                  });
                  toast.success("Case created");
                  setSubject("");
                  setBody("");
                  void listQuery.refetch();
                } catch (err) {
                  toast.error(getErrorMessage(err));
                }
              }}
            >
              {createMutation.isPending ? "Submitting…" : "Submit case"}
            </Button>
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
            Your cases
          </p>
          <p className="mt-1 text-xs text-zinc-500">GET /platform/support/cases</p>
          <ul className="mt-4 space-y-3">
            {listQuery.isPending ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              (listQuery.data ?? []).map((c, i) => (
                <li
                  key={String(c.id ?? i)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm light:border-zinc-200 light:bg-white/80"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-zinc-100 light:text-zinc-900">
                      {c.subject ?? "Case"}
                    </p>
                    <StatusBadge status={c.status} />
                  </div>
                  {c.body ? (
                    <p className="mt-2 text-xs text-zinc-500">{c.body}</p>
                  ) : null}
                  {c.id ? (
                    <p className="mt-2 break-all font-mono text-[10px] text-zinc-600">
                      {c.id}
                    </p>
                  ) : null}
                </li>
              ))
            )}
            {!listQuery.isPending && (listQuery.data?.length ?? 0) === 0 ? (
              <li className="text-sm text-zinc-500">No cases yet</li>
            ) : null}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
