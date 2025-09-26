"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface SidebarIconProps {
  isCollapsed: boolean;
  onClick: () => void;
}

const SidebarIcon: React.FC<SidebarIconProps> = ({ isCollapsed, onClick }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors ${
        isDarkMode
          ? "bg-[var(--muted)] hover:bg-[var(--accent)]"
          : "bg-transparent hover:bg-neutral-100"
      }`}
      aria-label={isCollapsed ? "Open sidebar" : "Close sidebar"}
      type="button"
    >
      <Image
        src={isDarkMode ? "/img/white_sidebar.svg" : "/img/black_sidebar.svg"}
        alt="nilGPT Logo"
        width={24}
        height={24}
      />
    </button>
  );
};

export default SidebarIcon;
