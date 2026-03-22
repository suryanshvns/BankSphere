"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export default function HomePage() {
  const router = useRouter();
  const [isRouting, setIsRouting] = useState(false);

  useEffect(() => {
    void Promise.resolve(useAuthStore.persist.rehydrate()).then(() => {
      const t = useAuthStore.getState().token;
      router.replace(t ? "/dashboard" : "/login");
      setIsRouting(true);
    });
  }, [router]);

  if (!isRouting) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm text-zinc-500">Loading…</p>
      </div>
    );
  }

  return null;
}
