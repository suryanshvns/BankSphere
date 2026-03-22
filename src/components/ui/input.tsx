"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, type = "text", ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "w-full rounded-xl border border-white/10 bg-black/25 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500",
        "shadow-inner shadow-black/20 outline-none ring-0 transition-all duration-200",
        "focus:border-cyan-400/40 focus:bg-black/35 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.12)]",
        "light:border-zinc-200 light:bg-white light:text-zinc-900 light:placeholder:text-zinc-400 light:shadow-none",
        "light:focus:border-cyan-500/50 light:focus:shadow-[0_0_0_3px_rgba(6,182,212,0.15)]",
        className
      )}
      {...props}
    />
  );
});
