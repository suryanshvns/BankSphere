"use client";

import { MoonIcon, SunIcon } from "@/components/icons/sun-moon-icons";
import { useThemeStore } from "@/store/theme-store";

export function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/6 text-zinc-200 shadow-inner shadow-black/20 transition-all duration-200 hover:border-cyan-400/30 hover:bg-white/10 hover:text-amber-200 light:border-zinc-200 light:bg-white light:text-zinc-700 light:shadow-sm light:hover:border-cyan-300 light:hover:bg-zinc-50 light:hover:text-cyan-800"
    >
      {theme === "dark" ? (
        <SunIcon className="h-[22px] w-[22px]" />
      ) : (
        <MoonIcon className="h-[22px] w-[22px]" />
      )}
    </button>
  );
}
