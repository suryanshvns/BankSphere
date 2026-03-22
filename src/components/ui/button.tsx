"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

const variants = {
  primary:
    "bg-linear-to-r from-cyan-500 via-cyan-400 to-violet-500 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-white/20 hover:shadow-xl hover:shadow-cyan-500/30 hover:ring-white/30 hover:brightness-105 active:scale-[0.98] active:brightness-95",
  secondary:
    "border border-white/15 bg-white/8 text-zinc-100 shadow-sm ring-1 ring-white/5 backdrop-blur-sm hover:bg-white/12 hover:border-white/25 light:border-zinc-200 light:bg-white/80 light:text-zinc-900 light:ring-zinc-200/60 light:hover:bg-white light:hover:border-zinc-300",
  ghost:
    "text-zinc-400 hover:bg-white/8 hover:text-zinc-200 light:text-zinc-600 light:hover:bg-zinc-100 light:hover:text-zinc-900",
  danger:
    "bg-linear-to-r from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-900/30 ring-1 ring-white/15 hover:brightness-110 active:scale-[0.98]",
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, variant = "primary", disabled, ...props }, ref) {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold tracking-tight transition-all duration-200 ease-out",
          "focus-visible:ring-2 focus-visible:ring-cyan-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 light:focus-visible:ring-offset-white",
          "disabled:pointer-events-none disabled:opacity-45",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
