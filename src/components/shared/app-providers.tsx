"use client";

import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import { useThemeStore } from "@/store/theme-store";
import { QueryProvider } from "@/components/shared/query-provider";

function ThemeSync() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme === "light" ? "light" : "dark");
  }, [theme]);

  return (
    <Toaster richColors closeButton theme={theme} className="toaster-group" />
  );
}

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      {children}
      <ThemeSync />
    </QueryProvider>
  );
}
