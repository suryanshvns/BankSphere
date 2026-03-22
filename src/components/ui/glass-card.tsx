"use client";

import { cn } from "@/utils/cn";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Prominent top accent for hero / balance cards */
  highlight?: boolean;
};

export function GlassCard({
  className,
  children,
  highlight = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-5 shadow-xl backdrop-blur-xl transition-all duration-300",
        "border-white/8 bg-linear-to-br from-white/9 to-white/2",
        "shadow-black/25 light:border-zinc-200/90 light:from-white/95 light:to-white/80 light:shadow-zinc-900/5",
        "hover:border-white/12 hover:shadow-2xl hover:shadow-cyan-950/20",
        "light:hover:border-zinc-300/90 light:hover:shadow-indigo-100/80",
        highlight &&
          "border-cyan-500/20 shadow-cyan-950/30 light:border-cyan-200/60 light:shadow-cyan-100/50",
        className
      )}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-400/50 to-transparent opacity-80 light:via-cyan-500/35"
        aria-hidden
      />
      {highlight ? (
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-linear-to-br from-cyan-400/15 to-violet-600/10 blur-2xl light:from-cyan-400/25 light:to-violet-400/15"
          aria-hidden
        />
      ) : null}
      <div className="relative z-1">{children}</div>
    </div>
  );
}
