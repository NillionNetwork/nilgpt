"use client";

import { useTheme } from "next-themes";

interface SignInButtonProps {
  onSignIn: () => void;
}

const SignInButton: React.FC<SignInButtonProps> = ({ onSignIn }) => {
  const { theme } = useTheme();

  return (
    <button
      type="button"
      onClick={onSignIn}
      className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-white bg-neutral-100 dark:bg-transparent rounded-full hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors mr-2"
      data-umami-event={
        theme === "dark" ? "Sign In Clicked - Nilia" : "Sign In Clicked"
      }
    >
      Sign in
    </button>
  );
};

export default SignInButton;
