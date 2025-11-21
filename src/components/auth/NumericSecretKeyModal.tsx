"use client";

import { Delete } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";

interface NumericSecretKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PIN_LENGTH = 4;

export function NumericSecretKeyModal({
  isOpen,
  onClose,
}: NumericSecretKeyModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const { setUserSecretKeySeed, userSecretKeySeed } = useApp();

  useEffect(() => {
    if (isOpen && userSecretKeySeed) {
      onClose();
    }
  }, [isOpen, userSecretKeySeed, onClose]);

  // Handle keyboard input
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleNumberPress(e.key);
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key === "Enter" && pin.length === PIN_LENGTH) {
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, pin]);

  const handleNumberPress = (num: string) => {
    if (pin.length < PIN_LENGTH) {
      setPin((prev) => prev + num);
      setError("");
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError("");
  };

  const handleSubmit = () => {
    if (pin.length !== PIN_LENGTH) {
      setError("Please enter a 4-digit PIN");
      return;
    }

    setUserSecretKeySeed(pin);
    setPin("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  const numpadButtons = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "backspace"],
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] rounded-2xl p-8 w-full max-w-md mx-4 shadow-xl border border-[#333]">
        <h2 className="text-2xl font-bold mb-4 text-white text-center">
          Passphrase
        </h2>

        <div className="flex justify-center mb-2">
          <Image
            src="/img/key-icon.svg"
            alt="Key icon"
            width={72}
            height={72}
            className="w-[72px] invert"
          />
        </div>

        <p className="text-gray-300 mb-6 leading-relaxed text-center">
          Enter a 4-digit PIN to encrypt your chats.
          <br />
          <br />
          No one else knows this, so{" "}
          <strong className="text-white">keep it safe</strong> so you can
          decrypt your chats in the future.
        </p>

        {/* PIN Display Dots */}
        <div className="flex justify-center gap-4 mb-8">
          {Array.from({ length: PIN_LENGTH }).map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 transition-colors ${
                index < pin.length
                  ? "bg-[#FFC971] border-[#FFC971]"
                  : "bg-transparent border-[#555]"
              }`}
            />
          ))}
        </div>

        {/* Numpad Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {numpadButtons.flat().map((btn, index) => {
            if (btn === "") {
              return <div key={index} className="h-16" />;
            }

            if (btn === "backspace") {
              return (
                <button
                  key={index}
                  type="button"
                  onClick={handleBackspace}
                  className="h-16 rounded-xl bg-[#2a2a2a] border border-[#444] text-white hover:bg-[#333] active:bg-[#444] transition-colors flex items-center justify-center"
                  aria-label="Backspace"
                >
                  <Delete size={24} />
                </button>
              );
            }

            return (
              <button
                key={index}
                type="button"
                onClick={() => handleNumberPress(btn)}
                className="h-16 rounded-xl bg-[#2a2a2a] border border-[#444] text-white text-2xl font-medium hover:bg-[#333] active:bg-[#444] transition-colors"
              >
                {btn}
              </button>
            );
          })}
        </div>

        {/* Error Message */}
        {error && (
          <p className="mb-4 text-sm text-red-400 text-center">{error}</p>
        )}

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={pin.length !== PIN_LENGTH}
          className={`w-full py-3 px-6 rounded-full font-medium transition-colors ${
            pin.length === PIN_LENGTH
              ? "bg-[#FFC971] text-black hover:bg-[#FFD584]"
              : "bg-[#333] text-[#666] cursor-not-allowed"
          }`}
        >
          Unlock
        </button>
      </div>
    </div>
  );
}
