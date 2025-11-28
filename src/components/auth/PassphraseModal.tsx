"use client";

import { useEffect, useState } from "react";
import { NumericSecretKeyModal } from "./NumericSecretKeyModal";
import { SecretKeyModal } from "./SecretKeyModal";

interface PassphraseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PassphraseModal({ isOpen, onClose }: PassphraseModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check HTML element's class directly (most reliable source of truth)
    const hasDarkClass = document.documentElement.classList.contains("dark");
    setIsDark(hasDarkClass);

    // Listen for theme changes via MutationObserver
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  // Dark mode = Numeric PIN
  // Light mode = Text passphrase
  if (isDark) {
    return <NumericSecretKeyModal isOpen={isOpen} onClose={onClose} />;
  }

  return <SecretKeyModal isOpen={isOpen} onClose={onClose} />;
}
