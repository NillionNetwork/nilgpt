"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { NumericSecretKeyModal } from "./NumericSecretKeyModal";
import { SecretKeyModal } from "./SecretKeyModal";

interface PassphraseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PassphraseModal({ isOpen, onClose }: PassphraseModalProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  // Dark mode = Numeric PIN
  // Light mode = Text passphrase
  if (resolvedTheme === "dark") {
    return <NumericSecretKeyModal isOpen={isOpen} onClose={onClose} />;
  }

  return <SecretKeyModal isOpen={isOpen} onClose={onClose} />;
}
