import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface WalletButtonProps {
  onClose?: () => void;
}

function WalletButton({ onClose }: WalletButtonProps) {
  const { ready, authenticated, user } = usePrivy();
  const { login } = useLogin();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const disableLogin = !ready || (ready && authenticated) || isLoading;

  useEffect(() => {
    if (authenticated && user && isLoading) {
      // UserCreationHandler will handle createUser call
      // Just redirect to app page
      onClose?.();
      setTimeout(() => {
        router.push("/app");
      }, 100);
      setIsLoading(false);
    }
  }, [authenticated, user, isLoading, onClose, router]);

  const handleWalletLogin = async () => {
    if (disableLogin) return;

    try {
      setIsLoading(true);

      login({
        loginMethods: ["wallet"],
        walletChainType: "ethereum-and-solana",
        disableSignup: false,
      });
    } catch (error) {
      console.error("Wallet login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white dark:bg-[#2A2A2A] text-gray-500 dark:text-gray-400 font-medium">
            OR
          </span>
        </div>
      </div>

      <button
        type="button"
        disabled={disableLogin}
        onClick={handleWalletLogin}
        className={`
          flex items-center justify-between w-full px-4 py-3 mb-4
          border border-gray-300 dark:border-gray-600 rounded-lg
          bg-white dark:bg-[#383838] hover:bg-gray-50 dark:hover:bg-[#424242]
          text-gray-700 dark:text-gray-200 font-medium text-sm
          transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-[#383838]
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${isLoading ? "cursor-wait" : ""}
        `}
      >
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-[#2A2A2A]">
            {isLoading ? (
              <svg
                className="animate-spin h-3 w-3 text-gray-600 dark:text-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600 dark:text-gray-300"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <polyline points="3,10 12,10 21,10" />
              </svg>
            )}
          </div>
          <span>{isLoading ? "Connecting..." : "Continue with a wallet"}</span>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-400 dark:text-gray-500"
        >
          <polyline points="9,18 15,12 9,6" />
        </svg>
      </button>
    </div>
  );
}

export default WalletButton;
