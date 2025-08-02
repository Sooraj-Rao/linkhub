"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ children }: { children?: React.ReactNode }) {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className=" w-full"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {children ? (
        children
      ) : theme !== "light" ? (
        <Sun size={16} />
      ) : (
        <Moon size={16} />
      )}
    </button>
  );
}
