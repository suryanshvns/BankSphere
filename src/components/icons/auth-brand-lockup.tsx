import Link from "next/link";
import { BankSphereMark } from "@/components/icons/bank-sphere-mark";

/** Centered logo + wordmark for auth screens */
export function AuthBrandLockup() {
  return (
    <Link
      href="/login"
      className="group mb-8 flex flex-col items-center gap-3 text-center md:mb-10"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-400 via-cyan-500 to-violet-600 text-white shadow-lg shadow-cyan-500/35 ring-2 ring-white/15 transition group-hover:shadow-cyan-400/45 group-hover:ring-white/25 light:shadow-indigo-200/50">
        <BankSphereMark className="h-8 w-8" />
      </span>
      <div>
        <p className="text-lg font-semibold tracking-tight text-white light:text-zinc-900">
          BankSphere
        </p>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
          Customer
        </p>
      </div>
    </Link>
  );
}
