"use client";

import Image from "next/image";
import type React from "react";

interface SidebarIconProps {
  isCollapsed: boolean;
  onClick: () => void;
}

const SidebarIcon: React.FC<SidebarIconProps> = ({ isCollapsed, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
      aria-label={isCollapsed ? "Open sidebar" : "Close sidebar"}
      type="button"
    >
      <Image
        src="/img/black_sidebar.svg"
        alt="Toggle sidebar"
        width={24}
        height={24}
        className="dark:hidden"
      />
      <Image
        src="/img/white_sidebar.svg"
        alt="Toggle sidebar"
        width={24}
        height={24}
        className="hidden dark:block"
      />
    </button>
  );
};

export default SidebarIcon;
