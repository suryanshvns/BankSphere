"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

export function DashboardQuickActions() {
  return (
    <GlassCard>
      <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
        Quick actions
      </p>
      <div className="mt-4 flex flex-col gap-2">
        <Link href="/transfer" className="block">
          <Button type="button" className="w-full" variant="secondary">
            Transfer between accounts
          </Button>
        </Link>
        <Link href="/loans" className="block">
          <Button type="button" className="w-full" variant="secondary">
            Apply for a loan
          </Button>
        </Link>
        <Link href="/transactions" className="block">
          <Button type="button" className="w-full" variant="ghost">
            All transactions
          </Button>
        </Link>
      </div>
    </GlassCard>
  );
}
