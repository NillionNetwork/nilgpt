"use client";

import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from "react";

interface CustomStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

// Extend props to include storage (supported but not in official types)
interface ExtendedThemeProviderProps extends ThemeProviderProps {
  storage?: CustomStorage;
}

// Custom storage that uses sessionStorage instead of localStorage
const customStorage: CustomStorage = {
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

  const extendedProps: ExtendedThemeProviderProps = {
    attribute: "class",
    // defaultTheme: "system",
    // enableSystem: true,
    disableTransitionOnChange: true,
    storageKey: "theme",
    storage: customStorage,
    children,
    ...props,
  };

  return <NextThemesProvider {...(extendedProps as ThemeProviderProps)} />;
}
