"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "@/providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="relative flex items-center justify-center w-11 h-11 bg-transparent border-2 border-transparent cursor-pointer text-coal transition-colors hover:border-coal max-sm:hidden"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? <Moon size={22} /> : <Sun size={22} />}
    </button>
  );
}
