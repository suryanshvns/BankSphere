"use client";

import { cn } from "@/utils/cn";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 light:text-zinc-500",
        className
      )}
      {...props}
    />
  );
}
