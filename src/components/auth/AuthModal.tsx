import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/UnifiedAuthProvider";
import WalletButton from "./WalletButton";

type AuthMode = "signin" | "signup" | "forgot-password";

export default function AuthModal({
  mode: initialMode,
  onClose,
}: {
  mode: "signin" | "signup";
  onClose: () => void;
}) {
  const [mode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [keepMePosted, setKeepMePosted] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { signIn, signUp } = useAuth();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "signin") {
        await signIn(email, password);
        onClose();
      } else {
        await signUp(email, password, name, keepMePosted);
        setShowEmailConfirmation(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (showEmailConfirmation) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div
          className={`rounded-lg p-8 max-w-md w-full mx-4 ${
            isDarkMode
              ? "bg-[var(--card)] text-[var(--card-foreground)]"
              : "bg-white"
          }`}
        >
          <h2
            className={`text-2xl font-bold mb-4 ${
              isDarkMode ? "text-[var(--foreground)]" : ""
            }`}
          >
            Check your email
          </h2>
          <p
            className={`mb-6 ${
              isDarkMode ? "text-[var(--muted-foreground)]" : "text-gray-600"
            }`}
          >
            We&apos;ve sent a confirmation link to{" "}
            <span className="font-medium">{email}</span>. Please check your
            email to complete your registration.
          </p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`rounded-lg p-8 max-w-md w-full mx-4 ${
          isDarkMode
            ? "bg-[var(--card)] text-[var(--card-foreground)]"
            : "bg-white"
        }`}
      >
        <h2
          className={`text-2xl font-bold mb-6 ${
            isDarkMode ? "text-[var(--foreground)]" : ""
          }`}
        >
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="mb-4">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode
                    ? "text-[var(--muted-foreground)]"
                    : "text-gray-700"
                }`}
              >
                Username
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  isDarkMode
                    ? "bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]"
                    : "border-gray-300"
                }`}
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-[var(--muted-foreground)]" : "text-gray-700"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${
                isDarkMode
                  ? "bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]"
                  : "border-gray-300"
              }`}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-[var(--muted-foreground)]" : "text-gray-700"
              }`}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${
                isDarkMode
                  ? "bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]"
                  : "border-gray-300"
              }`}
              required
            />
          </div>
          <div className="mb-6">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                className="w-3 h-3"
                checked={keepMePosted}
                onChange={(e) => setKeepMePosted(e.target.checked)}
              />
              <span
                className={`items-start text-[10px] ${
                  isDarkMode
                    ? "text-[var(--muted-foreground)]"
                    : "text-gray-600"
                }`}
              >
                Keep me posted on what&apos;s new via marketing emails
              </span>
            </label>
          </div>
          <WalletButton onClose={onClose} />
          {mode === "signup" && (
            <div className="mb-6">
              <p
                className={`text-sm ${
                  isDarkMode
                    ? "text-[var(--muted-foreground)]"
                    : "text-gray-600"
                }`}
              >
                By agreeing to sign up you are agreeing to the{" "}
                <Link
                  href="/terms-services"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  terms and services
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  privacy policy
                </Link>
              </p>
            </div>
          )}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-sm font-medium ${
                isDarkMode
                  ? "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
              data-umami-event={
                mode === "signin" ? "Sign In Clicked" : "Sign Up Clicked"
              }
            >
              {mode === "signin" ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
