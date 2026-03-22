"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { setAccessToken } from "@/services/session";
import { Skeleton } from "@/components/ui/skeleton";

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    void Promise.resolve(useAuthStore.persist.rehydrate()).then(() => {
      const t = useAuthStore.getState().token;
      setAccessToken(t);
      setIsReady(true);
      if (!t) router.replace("/login");
    });
  }, [router]);

  useEffect(() => {
    if (!isReady) return;
    setAccessToken(token);
    if (!token) router.replace("/login");
  }, [isReady, token, router]);

  if (!isReady) {
    return (
      <div className="flex flex-1 flex-col gap-3 p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full max-w-xl" />
        <Skeleton className="h-32 w-full max-w-xl" />
      </div>
    );
  }

  if (!token) return null;
  return <>{children}</>;
}
