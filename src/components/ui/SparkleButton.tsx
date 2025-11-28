import type React from "react";

interface SparkleButtonProps {
  text: string;
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  dataUmamiEvent?: string;
  className?: string;
}

export default function SparkleButton({
  text,
  href,
  onClick,
  dataUmamiEvent,
  className = "",
}: SparkleButtonProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      data-umami-event={dataUmamiEvent}
      className={`group relative rounded-full bg-[#111111] px-8 py-3 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-[#111111]/40 cursor-pointer inline-block ${className}`}
    >
      {/* Sparkle decorations */}
      <span className="absolute -left-2 -top-2 text-xs text-white/50 transition-all group-hover:text-white/80">
        ✦
      </span>
      <span className="absolute -right-1 -top-1 text-[10px] text-white/30 transition-all group-hover:text-white/60">
        ✦
      </span>
      <span className="absolute -bottom-1 -right-2 text-xs text-white/40 transition-all group-hover:text-white/70">
        ✦
      </span>
      <span className="absolute -bottom-2 left-1 text-[10px] text-white/30 transition-all group-hover:text-white/60">
        ·
      </span>
      <span className="absolute -top-1 left-4 text-[10px] text-white/30 transition-all group-hover:text-white/60">
        ·
      </span>
      {text}
    </a>
  );
}
