"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { useEffect } from "react";

// Custom storage that uses sessionStorage instead of localStorage
const customStorage = {
  getItem: (key: string) => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(key, value);
  },
};

export default function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  // Sync theme from localStorage to sessionStorage on mount
  // This ensures theme persists within the session but not across sessions
  useEffect(() => {
    if (typeof window === "undefined") return;

    const localTheme = localStorage.getItem("theme");
    if (localTheme) {
      sessionStorage.setItem("theme", localTheme);
      localStorage.removeItem("theme"); // Clean up old localStorage
    }
  }, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="theme"
      storage={customStorage}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
