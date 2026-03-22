import { AuthBrandLockup } from "@/components/icons/auth-brand-lockup";

type AuthLayoutFrameProps = {
  children: React.ReactNode;
};

/** Ambient orbs + centered column for login / signup */
export function AuthLayoutFrame({ children }: AuthLayoutFrameProps) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden p-4 py-16 md:py-20">
      <div
        className="pointer-events-none absolute -left-20 top-1/4 h-[420px] w-[420px] rounded-full bg-linear-to-br from-cyan-500/25 to-transparent blur-[90px] light:from-cyan-400/30"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-1/4 h-[380px] w-[380px] rounded-full bg-linear-to-tl from-violet-600/20 to-transparent blur-[80px] light:from-violet-500/25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[min(90vw,720px)] -translate-x-1/2 -translate-y-1/2 bg-linear-to-r from-transparent via-white/10 to-transparent light:via-zinc-300/40"
        aria-hidden
      />
      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        <AuthBrandLockup />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
