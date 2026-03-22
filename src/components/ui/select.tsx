"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full cursor-pointer rounded-xl border border-white/10 bg-black/25 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition-all duration-200",
        "focus:border-cyan-400/40 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.12)]",
        "light:border-zinc-200 light:bg-white light:text-zinc-900 light:focus:border-cyan-500/50 light:focus:shadow-[0_0_0_3px_rgba(6,182,212,0.15)]",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});
