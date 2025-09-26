"use client";

import { ChevronDown, Moon, Palette, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const themes = [
  { value: "light", label: "Light", icon: <Sun className="w-4 h-4" /> },
  {
    value: "dark-blue",
    label: "Dark Blue",
    icon: <Moon className="w-4 h-4" />,
  },
  {
    value: "dark-sepia",
    label: "Dark Sepia",
    icon: <Palette className="w-4 h-4" />,
  },
];

export default function SimpleThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState("light");
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("nilgpt-theme") || "light";
    setCurrentTheme(savedTheme);

    // Remove all theme classes first
    document.documentElement.classList.remove(
      "theme-light",
      "theme-dark-blue",
      "theme-dark-sepia",
    );

    // Add the saved theme class
    document.documentElement.classList.add(`theme-${savedTheme}`);

    // Check if dark mode
    const isDark = savedTheme === "dark-blue" || savedTheme === "dark-sepia";
    setIsDarkMode(isDark);

    console.log(
      `Initial theme loaded: ${savedTheme}, class applied: theme-${savedTheme}`,
    );
    console.log("Document classes:", document.documentElement.className);
  }, []);

  useEffect(() => {
    const checkTheme = () => {
      const isDark =
        document.documentElement.classList.contains("theme-dark-blue") ||
        document.documentElement.classList.contains("theme-dark-sepia");
      setIsDarkMode(isDark);
    };

    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem("nilgpt-theme", theme);

    // Remove all theme classes first
    document.documentElement.classList.remove(
      "theme-light",
      "theme-dark-blue",
      "theme-dark-sepia",
    );

    // Add the new theme class
    document.documentElement.classList.add(`theme-${theme}`);

    console.log(`Theme changed to: ${theme}, class applied: theme-${theme}`);
    console.log("Document classes:", document.documentElement.className);
    setIsOpen(false);
  };

  const currentThemeData = themes.find((t) => t.value === currentTheme);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          isDarkMode
            ? "bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--accent)]"
            : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
        } border`}
      >
        {currentThemeData?.icon}
        <span className="text-sm font-medium">{currentThemeData?.label}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg z-50 ${
              isDarkMode
                ? "bg-[var(--card)] border-[var(--border)]"
                : "bg-white border-gray-200"
            } border`}
          >
            <div className="p-2">
              {themes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => handleThemeChange(theme.value)}
                  className={`w-full flex items-center gap-3 p-2 rounded-md transition-colors ${
                    currentTheme === theme.value
                      ? isDarkMode
                        ? "bg-[var(--accent)] text-[var(--foreground)]"
                        : "bg-blue-50 text-blue-700"
                      : isDarkMode
                        ? "hover:bg-[var(--muted)] text-[var(--foreground)]"
                        : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {theme.icon}
                  <span className="text-sm font-medium">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
