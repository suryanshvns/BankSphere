"use client";

import { cn } from "@/utils/cn";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-lg bg-white/7 light:bg-zinc-200/90",
        className
      )}
      {...props}
    />
  );
}
