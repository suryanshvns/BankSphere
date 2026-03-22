"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useDataExportStatusQuery,
  useRequestDataExportMutation,
} from "@/hooks/use-platform-privacy";
import { getErrorMessage } from "@/services/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function pickExportId(data: { id?: string; export_id?: string } | undefined) {
  if (!data) return "";
  return data.export_id ?? data.id ?? "";
}

export function PrivacyExportCard() {
  const requestMutation = useRequestDataExportMutation();
  const [exportIdInput, setExportIdInput] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const statusQuery = useDataExportStatusQuery(activeId);

  useEffect(() => {
    if (statusQuery.isError && statusQuery.error) {
      toast.error(getErrorMessage(statusQuery.error));
    }
  }, [statusQuery.isError, statusQuery.error]);

  const displayJson =
    statusQuery.data != null ? JSON.stringify(statusQuery.data, null, 2) : "";

  return (
    <GlassCard>
      <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
        Privacy — data export
      </p>
      <p className="mt-1 text-xs text-zinc-500">
        POST /platform/privacy/data-export · GET …/{"{id}"}
      </p>

      <div className="mt-4 space-y-4">
        <Button
          type="button"
          variant="secondary"
          disabled={requestMutation.isPending}
          onClick={async () => {
            try {
              const data = await requestMutation.mutateAsync();
              const id = pickExportId(data);
              if (id) {
                setExportIdInput(id);
                setActiveId(id);
              }
              toast.success(
                id ? "Export requested — tracking status below" : "Export requested"
              );
            } catch (err) {
              toast.error(getErrorMessage(err));
            }
          }}
        >
          {requestMutation.isPending ? "Requesting…" : "Request new export"}
        </Button>

        <div>
          <Label htmlFor="export-id">Export ID</Label>
          <Input
            id="export-id"
            className="mt-1.5 font-mono text-xs"
            value={exportIdInput}
            onChange={(e) => setExportIdInput(e.target.value)}
            placeholder="UUID from request response"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={!exportIdInput.trim()}
              onClick={() => setActiveId(exportIdInput.trim())}
            >
              Load status
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="text-xs"
              disabled={!activeId}
              onClick={() => void statusQuery.refetch()}
            >
              Refresh
            </Button>
          </div>
        </div>

        {statusQuery.isFetching ? (
          <Skeleton className="h-40 w-full" />
        ) : displayJson ? (
          <pre className="max-h-64 overflow-auto rounded-xl border border-white/10 bg-zinc-950/50 p-3 text-[11px] leading-relaxed text-zinc-300 light:border-zinc-200 light:bg-zinc-50 light:text-zinc-800">
            {displayJson}
          </pre>
        ) : activeId ? (
          <p className="text-sm text-zinc-500">No payload yet</p>
        ) : null}
      </div>
    </GlassCard>
  );
}
