"use client";

import Image from "next/image";
import { navigateWithTheme } from "@/utils/themeNavigation";

interface HeaderProps {
  targetTheme?: "light" | "dark";
}

const Header = ({ targetTheme = "light" }: HeaderProps) => {
  const onGoToAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (targetTheme === "dark") {
      window.ttq?.track("ClickButton", {
        content_name: "Go to app",
      });
    }
    setTimeout(() => {
      navigateWithTheme("/app", targetTheme);
    }, 500);
  };

  return (
    <header className="absolute top-4 left-4 right-4 z-50">
      <div
        className="bg-[#FEFEFF] dark:bg-transparent rounded-[1000px] shadow-lg dark:shadow-none backdrop-blur-sm border border-gray-100/20 dark:border-transparent"
        style={{
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.05)",
          padding: "16px 32px 16px 16px",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <Image
                src="/img/black_logo.png"
                alt="nilGPT Logo"
                width={24}
                height={24}
                className="block dark:hidden"
              />
              <Image
                src="/img/reskin_logo.svg"
                alt="nilGPT Logo"
                width={24}
                height={24}
                className="hidden dark:block"
              />
              <div className="font-display font-extra-bold text-2xl text-black dark:text-white">
                nilGPT
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-10">
              <a
                href="#testimonials"
                className="font-medium text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors text-lg"
              >
                Who is it for?
              </a>
              <a
                href="#features"
                className="font-medium text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors text-lg"
              >
                Features
              </a>
              <a
                href="#faq"
                className="font-medium text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors text-lg"
              >
                FAQ
              </a>
            </nav>
          </div>

          <a
            href="/app"
            onClick={onGoToAppClick}
            data-umami-event={
              targetTheme === "dark"
                ? "Go To App Clicked - Nilia"
                : "Go To App Clicked"
            }
            className={`bg-[#F7F6F2] dark:bg-[#747474] text-black dark:text-white px-4 py-2 font-medium text-lg rounded-full hover:bg-[#F0EFE9] dark:hover:bg-[#222222] border border-transparent dark:hover:border-white transition-colors flex items-center gap-2 cursor-pointer ${targetTheme === "dark" ? "plausible-event-name=Go+To+App+Clicked+-+Nilia" : ""}`}
          >
            <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
            Go to app
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
