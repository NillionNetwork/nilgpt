"use client";

import { useEffect, useState } from "react";
import { NumericSecretKeyModal } from "./NumericSecretKeyModal";
import { SecretKeyModal } from "./SecretKeyModal";

interface PassphraseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PassphraseModal({ isOpen, onClose }: PassphraseModalProps) {
  const [niliaMode, setNiliaMode] = useState<string | null>(null);

  useEffect(() => {
    setNiliaMode(sessionStorage.getItem("nilia"));
  }, []);

  if (niliaMode) {
    return <NumericSecretKeyModal isOpen={isOpen} onClose={onClose} />;
  }

  return <SecretKeyModal isOpen={isOpen} onClose={onClose} />;
}
