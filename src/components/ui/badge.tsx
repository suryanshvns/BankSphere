"use client";

import { cn } from "@/utils/cn";

const tone: Record<string, string> = {
  success: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  pending: "bg-amber-500/15 text-amber-200 ring-amber-500/30",
  failed: "bg-rose-500/15 text-rose-200 ring-rose-500/30",
  default: "bg-white/10 text-zinc-200 ring-white/10",
};

export function StatusBadge({
  status,
  className,
}: {
  status?: string;
  className?: string;
}) {
  const s = (status ?? "").toLowerCase();
  let key: keyof typeof tone = "default";
  if (s.includes("complete") || s.includes("success") || s === "posted")
    key = "success";
  else if (s.includes("pend") || s.includes("process")) key = "pending";
  else if (s.includes("fail") || s.includes("reject")) key = "failed";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset",
        tone[key],
        className
      )}
    >
      {status ?? "—"}
    </span>
  );
}
