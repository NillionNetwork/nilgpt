"use client";

import { useTheme } from "next-themes";

interface SignUpButtonProps {
  onSignUp: () => void;
}

const SignUpButton: React.FC<SignUpButtonProps> = ({ onSignUp }) => {
  const { theme } = useTheme();

  return (
    <button
      type="button"
      onClick={onSignUp}
      className="px-4 py-2 text-sm font-medium text-white dark:text-black bg-black dark:bg-white rounded-full hover:bg-neutral-800 dark:hover:bg-gray-100 transition-colors plausible-event-name=Sign+Up+Clicked+-+Nilia"
      data-umami-event={
        theme === "dark" ? "Sign Up Clicked - Nilia" : "Sign Up Clicked"
      }
    >
      Sign up
    </button>
  );
};

export default SignUpButton;
