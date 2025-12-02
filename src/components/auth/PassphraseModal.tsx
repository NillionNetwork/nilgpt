"use client";

import { useState } from "react";
import { NumericSecretKeyModal } from "./NumericSecretKeyModal";
import { SecretKeyModal } from "./SecretKeyModal";

interface PassphraseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PassphraseModal({ isOpen, onClose }: PassphraseModalProps) {
  // Initialize from sessionStorage to avoid flash
  const [niliaMode] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("nilia");
  });

  if (niliaMode === "true") {
    return <NumericSecretKeyModal isOpen={isOpen} onClose={onClose} />;
  }

  return <SecretKeyModal isOpen={isOpen} onClose={onClose} />;
}
