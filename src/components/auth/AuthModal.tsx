import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/UnifiedAuthProvider";
import WalletButton from "./WalletButton";

type AuthMode = "signin" | "signup" | "forgot-password";

// Generate email from username: username@nilgpt-user.xyz
function generateEmailFromUsername(username: string): string {
  return `${username}@nilgpt-user.xyz`;
}

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
  const [_showEmailConfirmation, _setShowEmailConfirmation] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const { signIn, signUp } = useAuth();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check for Nilia mode flag directly
  // Nilia mode = username+password, Regular mode = email+password
  const isFromNilia =
    mounted &&
    typeof window !== "undefined" &&
    sessionStorage.getItem("nilia") === "true";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isFromNilia) {
        // For nilia users: generate email automatically from username
        const generatedEmail = generateEmailFromUsername(name);

        if (mode === "signin") {
          await signIn(generatedEmail, password);
          onClose();
        } else {
          await signUp(generatedEmail, password, name, keepMePosted);
          onClose();
        }
      } else {
        // For regular users: use email field
        if (mode === "signin") {
          await signIn(email, password);
          onClose();
        } else {
          await signUp(email, password, name, keepMePosted);
          onClose();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Disabled: Email confirmation modal
  // if (showEmailConfirmation) {
  //   return (
  //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  //       <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
  //         <h2 className="text-2xl font-bold mb-4">Check your email</h2>
  //         <p className="text-gray-600 mb-6">
  //           We&apos;ve sent a confirmation link to{" "}
  //           <span className="font-medium">{email}</span>. Please check your
  //           email to complete your registration.
  //         </p>
  //         <div className="flex justify-end">
  //           <button
  //             onClick={onClose}
  //             className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
  //           >
  //             Close
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#2A2A2A] rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit}>
          {isFromNilia ? (
            // Nilia flow: Username + Password
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-transparent rounded-md dark:bg-[#4A4A4A] dark:text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-transparent rounded-md dark:bg-[#4A4A4A] dark:text-white"
                  required
                />
              </div>
            </>
          ) : (
            // Regular flow: Email + Password (and Username for signup)
            <>
              {mode === "signup" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-transparent rounded-md dark:bg-[#4A4A4A] dark:text-white"
                    required
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-transparent rounded-md dark:bg-[#4A4A4A] dark:text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-transparent rounded-md dark:bg-[#4A4A4A] dark:text-white"
                  required
                />
              </div>
            </>
          )}
          <div className="mb-6">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                className="w-3 h-3"
                checked={keepMePosted}
                onChange={(e) => setKeepMePosted(e.target.checked)}
              />
              <span className="items-start text-[10px] text-gray-600 dark:text-gray-300">
                Keep me posted on what&apos;s new via marketing emails
              </span>
            </label>
          </div>
          <WalletButton onClose={onClose} />
          {mode === "signup" && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                By agreeing to sign up you are agreeing to the{" "}
                <a
                  href="https://nillion.notion.site/nilGPT-Terms-of-Service-2261827799b4805bb956e7dbb828310c"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
                >
                  terms and services
                </a>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
                >
                  privacy policy
                </Link>
              </p>
            </div>
          )}
          {error && (
            <p className="text-red-500 dark:text-red-400 text-sm mb-4">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm font-medium text-white dark:text-black bg-black dark:bg-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 ${resolvedTheme === "dark" ? (mode === "signin" ? "plausible-event-name=Sign+In+Clicked+-+Nilia" : "plausible-event-name=Sign+Up+Clicked+-+Nilia") : ""}`}
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
