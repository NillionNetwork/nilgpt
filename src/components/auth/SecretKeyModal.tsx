"use client";

import { faker } from "@faker-js/faker";
import { Key } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";

interface SecretKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SecretKeyModal({ isOpen, onClose }: SecretKeyModalProps) {
  const [secretKey, setSecretKey] = useState("");
  const [error, setError] = useState("");
  const [copyNotice, setCopyNotice] = useState("");
  const { setUserSecretKeySeed, userSecretKeySeed } = useApp();

  const generatePassphrase = async () => {
    const numWords = 4;
    const parts: string[] = [];

    // Generate a mix of nouns, adjectives, and verbs for variety
    const wordTypes = [
      () => faker.word.noun(),
      () => faker.word.adjective(),
      () => faker.word.verb(),
    ];

    for (let i = 0; i < numWords; i++) {
      const randomType =
        wordTypes[Math.floor(Math.random() * wordTypes.length)];
      parts.push(randomType());
    }
    const phrase = parts.join(" ");
    setSecretKey(phrase);
    setError("");
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(phrase);
        setCopyNotice("Passphrase copied. Please paste somewhere safe.");
        window.setTimeout(() => setCopyNotice(""), 5000);
      }
    } catch {
      // If clipboard fails, silently ignore; the phrase is still in the input
    }
  };

  useEffect(() => {
    if (isOpen && userSecretKeySeed) {
      onClose();
    }
  }, [isOpen, userSecretKeySeed, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!secretKey.trim()) {
      setError("Please enter your passphrase");
      return;
    }

    setUserSecretKeySeed(secretKey);
    setSecretKey("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#F7F6F2] rounded-lg p-8 w-full max-w-md mx-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-black text-center">
          Passphrase
        </h2>
        <div className="flex justify-center mb-2">
          <Image
            src="/img/key-icon.svg"
            alt="Key icon"
            width={72}
            height={72}
            className="w-[72px]"
          />
        </div>
        <p className="text-gray-700 mb-6 leading-relaxed text-center">
          Enter a passphrase - any word or phrase - to protect your chats.
          Alternatively, generate a readable passphrase.
          <br />
          <br /> No one else knows this, so <strong>keep it safe</strong> so you
          can view your chats in the future.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                id="secretKey"
                type="password"
                value={secretKey}
                onChange={(e) => {
                  setSecretKey(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFC971] focus:border-[#FFC971] bg-white text-black placeholder-gray-500"
                placeholder="Enter your passphrase..."
                autoFocus
              />
              <button
                type="button"
                onClick={generatePassphrase}
                className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-full bg-white text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFC971]"
                aria-label="Generate passphrase"
                title="Generate passphrase"
              >
                <Key size={18} />
                <span>New</span>
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
            )}
            {copyNotice && (
              <p className="mt-2 text-sm text-green-700 text-center">
                {copyNotice}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-[#FFC971] py-3 px-6 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FFC971] focus:ring-offset-2 transition-colors font-medium"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
