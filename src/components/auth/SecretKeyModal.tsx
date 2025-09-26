"use client";

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { setUserSecretKeySeed, userSecretKeySeed } = useApp();

  useEffect(() => {
    if (isOpen && userSecretKeySeed) {
      onClose();
    }
  }, [isOpen, userSecretKeySeed, onClose]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!secretKey.trim()) {
      setError("Please enter your secret key");
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
      <div
        className={`rounded-lg p-8 w-full max-w-md mx-4 shadow-lg ${
          isDarkMode
            ? "bg-[var(--card)] text-[var(--card-foreground)]"
            : "bg-[#F7F6F2] text-black"
        }`}
      >
        <h2
          className={`text-2xl font-bold mb-4 ${
            isDarkMode ? "text-[var(--foreground)]" : "text-black"
          }`}
        >
          Enter Your Passphrase
        </h2>
        <p
          className={`mb-6 leading-relaxed ${
            isDarkMode ? "text-[var(--muted-foreground)]" : "text-gray-700"
          }`}
        >
          Please create or enter your passphrase. This can be any word or
          phrase, and is used to encrypt all chat messages locally.
          <br />
          <br />
          Your passphrase never leaves your browser - it is stored in session
          storage and deleted if you close the tab.
          <br />
          <br /> Keep your passphrase secure. You&apos;ll need to use the same
          one every time you want to view a chat.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="secretKey"
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-[var(--muted-foreground)]" : "text-gray-700"
              }`}
            >
              Passphrase
            </label>
            <input
              id="secretKey"
              type="password"
              value={secretKey}
              onChange={(e) => {
                setSecretKey(e.target.value);
                setError("");
              }}
              className={`w-full px-4 py-3 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFC971] focus:border-[#FFC971] ${
                isDarkMode
                  ? "border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder-[var(--muted-foreground)]"
                  : "border-gray-300 bg-white text-black placeholder-gray-500"
              }`}
              placeholder="Enter your passphrase..."
              autoFocus
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFC971] focus:ring-offset-2 transition-colors font-medium ${
              isDarkMode
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/80"
                : "bg-black text-[#FFC971] hover:bg-gray-800"
            }`}
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
