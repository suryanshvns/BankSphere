"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";
import { Button } from "./button";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onClose: () => void;
  loading?: boolean;
};

export function Modal({
  open,
  title,
  description,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
  loading,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal backdrop"
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity light:bg-zinc-900/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal
        className={cn(
          "relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 p-6 shadow-2xl backdrop-blur-2xl",
          "bg-linear-to-b from-zinc-900/95 to-zinc-950/98 ring-1 ring-white/10",
          "light:border-zinc-200/90 light:from-white light:to-zinc-50/95 light:ring-zinc-200/80"
        )}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-400/40 to-transparent light:via-cyan-500/30" />
        <h2 className="text-lg font-semibold tracking-tight text-white light:text-zinc-900">
          {title}
        </h2>
        {description ? (
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-400 light:text-zinc-600">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-5">{children}</div> : null}
        <div className="mt-6 flex justify-end gap-2 border-t border-white/5 pt-5 light:border-zinc-200/80">
          <Button type="button" variant="secondary" onClick={onClose}>
            {cancelLabel}
          </Button>
          {onConfirm ? (
            <Button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="min-w-[100px]"
            >
              {loading ? "…" : confirmLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}
