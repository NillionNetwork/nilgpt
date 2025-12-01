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
  // Force apply theme from sessionStorage on mount
  // This ensures navigation from landing pages preserves theme
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if this is a Nilia user (persistent flag in localStorage)
    const isNiliaUser = localStorage.getItem("nilia_user") === "true";

    if (isNiliaUser) {
      // Restore Nilia session from persistent flag
      sessionStorage.setItem("nilia", "true");
      sessionStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      // Regular flow - check session storage
      const sessionTheme = sessionStorage.getItem("theme");

      // Migrate from localStorage if needed
      const localTheme = localStorage.getItem("theme");
      if (localTheme) {
        sessionStorage.setItem("theme", localTheme);
        localStorage.removeItem("theme");
      }

      // Force apply theme from sessionStorage if it exists
      if (sessionTheme) {
        const html = document.documentElement;
        if (sessionTheme === "dark") {
          html.classList.add("dark");
        } else {
          html.classList.remove("dark");
        }
      }
    }
  }, []);

  const extendedProps: ExtendedThemeProviderProps = {
    attribute: "class",
    defaultTheme: "light",
    enableSystem: false,
    disableTransitionOnChange: true,
    storageKey: "theme",
    storage: customStorage,
    children,
    ...props,
  };

  return <NextThemesProvider {...(extendedProps as ThemeProviderProps)} />;
}
