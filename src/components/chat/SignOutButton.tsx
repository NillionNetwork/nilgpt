"use client";

interface SignOutButtonProps {
  onSignOut: () => void;
}

const SignOutButton: React.FC<SignOutButtonProps> = ({ onSignOut }) => {
  return (
    <button
      type="button"
      onClick={onSignOut}
      className="px-4 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-neutral-800 transition-colors"
      data-umami-event="Sign Out Clicked"
    >
      Sign out
    </button>
  );
};

export default SignOutButton;
