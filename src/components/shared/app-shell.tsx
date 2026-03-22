"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import { useAuthStore } from "@/store/auth-store";
import { logoutWithRefresh } from "@/services/auth-session";
import { BankSphereMark } from "@/components/icons/bank-sphere-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const nav = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    href: "/accounts",
    label: "Accounts",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
  {
    href: "/transactions",
    label: "Transactions",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 4.5h12M3.75 6.75h.008v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.008v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 4.5h.008v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    href: "/transfer",
    label: "Transfer",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    href: "/recurring",
    label: "Recurring",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
  },
  {
    href: "/beneficiaries",
    label: "Payees",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.433-2.745 3.086 3.086 0 01-1.869-3.124 4.125 4.125 0 00-3.055-4.11 4.125 4.125 0 00-7.18 0 4.125 4.125 0 00-3.055 4.11 3.086 3.086 0 01-1.869 3.124 9.337 9.337 0 00-4.121.952 9.38 9.38 0 002.625.372m0 0h.008v.008H15V19.128z" />
      </svg>
    ),
  },
  {
    href: "/cards",
    label: "Cards",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path strokeLinecap="round" d="M3 10h18" />
      </svg>
    ),
  },
  {
    href: "/loans",
    label: "Loans",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: "/support",
    label: "Support",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "Profile",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
];

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleSignOut = () => {
    void (async () => {
      const rt = useAuthStore.getState().refreshToken;
      if (rt) {
        try {
          await logoutWithRefresh(rt);
        } catch {
          /* still sign out locally */
        }
      }
      logout();
      router.replace("/login");
    })();
  };

  return (
    <div className="relative z-1 flex min-h-0 flex-1 flex-col md:flex-row">
      <aside className="glass-panel flex flex-col border-b border-white/10 md:w-[260px] md:min-h-screen md:shrink-0 md:border-b-0 md:border-r light:border-zinc-200/80">
        <div className="flex items-center justify-between gap-3 p-4 md:flex-col md:items-stretch md:gap-4">
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 rounded-xl p-1 transition-colors md:ml-0"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-400 via-cyan-500 to-violet-600 text-white shadow-lg shadow-cyan-500/35 ring-2 ring-white/15 transition group-hover:shadow-cyan-400/45 group-hover:ring-white/25">
              <BankSphereMark className="h-6 w-6" />
            </span>
            <div className="min-w-0 text-left">
              <p className="truncate text-[15px] font-semibold tracking-tight text-white light:text-zinc-900">
                BankSphere
              </p>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                Customer
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-1 md:w-full md:justify-end">
            <ThemeToggle />
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:gap-0.5 md:px-3 md:pb-4">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-linear-to-r from-cyan-500/15 to-violet-500/10 text-white shadow-sm ring-1 ring-cyan-500/25 light:from-cyan-500/10 light:to-violet-500/5 light:text-zinc-900 light:ring-cyan-500/20"
                    : "text-zinc-400 hover:bg-white/6 hover:text-zinc-100 light:text-zinc-600 light:hover:bg-zinc-100 light:hover:text-zinc-900"
                )}
              >
                <span
                  className={cn(
                    "shrink-0 opacity-70 transition-opacity",
                    active && "opacity-100 text-cyan-300 light:text-cyan-600"
                  )}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto hidden border-t border-white/5 p-4 md:block light:border-zinc-200/80">
          <p className="truncate text-xs font-medium text-zinc-400 light:text-zinc-600">
            {user?.full_name ?? user?.email ?? "Signed in"}
          </p>
          <Button
            type="button"
            variant="ghost"
            className="mt-2 w-full justify-start rounded-lg px-2 py-2 text-xs text-zinc-500"
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        </div>
      </aside>
      <div className="relative flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-3.5 backdrop-blur-sm md:hidden light:border-zinc-200/80 light:bg-white/40">
          <p className="text-sm font-semibold tracking-tight text-zinc-100 light:text-zinc-900">
            {nav.find((n) => pathname.startsWith(n.href))?.label ?? "Menu"}
          </p>
          <Button
            type="button"
            variant="secondary"
            className="rounded-lg py-2 text-xs"
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-8 md:pl-10">
          <div className="app-main-inner">{children}</div>
        </main>
      </div>
    </div>
  );
}
