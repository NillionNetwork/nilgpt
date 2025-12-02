"use client";

import { useTheme } from "next-themes";

interface SignOutButtonProps {
  onSignOut: () => void;
}

const SignOutButton: React.FC<SignOutButtonProps> = ({ onSignOut }) => {
  const { theme } = useTheme();

  return (
    <button
      type="button"
      onClick={onSignOut}
      className="px-4 py-2 text-sm font-medium text-white dark:text-black bg-black dark:bg-white rounded-full hover:bg-neutral-800 dark:hover:bg-gray-100 transition-colors plausible-event-name=Sign+Out+Clicked+-+Nilia"
      data-umami-event={
        theme === "dark" ? "Sign Out Clicked - Nilia" : "Sign Out Clicked"
      }
    >
      Sign out
    </button>
  );
};

export default SignOutButton;
