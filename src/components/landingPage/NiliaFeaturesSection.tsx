"use client";

import Image from "next/image";
import SparkleButton from "@/components/ui/SparkleButton";
import { getThemeNavigationHandler } from "@/utils/themeNavigation";

interface NiliaFeaturesSectionProps {
  targetTheme?: "light" | "dark";
}

const NiliaFeaturesSection = ({
  targetTheme = "dark",
}: NiliaFeaturesSectionProps) => (
  <section id="features" className="py-20 bg-[#F7F6F2] dark:bg-[#1b1b1b]">
    <div className="max-w-7xl mx-auto px-4 md:px-10">
      <div className="text-center mb-10 md:mb-24">
        <h2 className="font-display text-5xl lg:text-6xl font-normal text-black dark:text-white mb-0 md:mb-6">
          Why You&apos;ll Love nilGPT
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-20 w-full">
        {[
          {
            icon: (
              <div className="w-16 h-16 bg-[#EDEAE0] dark:bg-transparent dark:border dark:border-white/20 rounded-full flex items-center justify-center">
                <Image
                  src="/img/shield.png"
                  alt="Shield"
                  width={24}
                  height={24}
                  className="dark:invert dark:brightness-0 dark:contrast-100"
                />
              </div>
            ),
            title: "Zero Data Retention",
            description:
              "Your thoughts stay yours. Nothing is saved, stored, or shared.",
          },
          {
            icon: (
              <div className="w-16 h-16 bg-[#EDEAE0] dark:bg-transparent dark:border dark:border-white/20 rounded-full flex items-center justify-center">
                <Image
                  src="/img/private.png"
                  alt="Private"
                  width={24}
                  height={24}
                  className="dark:invert dark:brightness-0 dark:contrast-100"
                />
              </div>
            ),
            title: "Private Inputs",
            description:
              "Say anything. It never becomes training data or part of any system.",
          },
          {
            icon: (
              <div className="w-16 h-16 bg-[#EDEAE0] dark:bg-transparent dark:border dark:border-white/20 rounded-full flex items-center justify-center">
                <Image
                  src="/img/shield.png"
                  alt="Shield"
                  width={24}
                  height={24}
                  className="dark:invert dark:brightness-0 dark:contrast-100"
                />
              </div>
            ),
            title: "Private Responses",
            description:
              "You receive your results in a protected, isolated environment — only accessible to you.",
          },
          {
            icon: (
              <div className="w-16 h-16 bg-[#EDEAE0] dark:bg-transparent dark:border dark:border-white/20 rounded-full flex items-center justify-center">
                <Image
                  src="/img/models.png"
                  alt="Models"
                  width={24}
                  height={24}
                  className="dark:invert dark:brightness-0 dark:contrast-100"
                />
              </div>
            ),
            title: "Multi Models",
            description:
              "Choose the vibe you need: supportive, direct, deep-thinking, or creative.",
          },
        ].map((feature, index) => (
          <div key={index} className="text-center">
            <div className="mb-8 flex justify-center">{feature.icon}</div>

            <h3 className="font-display text-3xl font-normal text-black dark:text-white mb-4">
              {feature.title}
            </h3>

            <p className="text-gray-600 dark:text-[#BBBBBB] text-xl leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
      <div className="flex text-center mt-16 space-y-6">
        {/* Light mode button */}
        <a
          href="/app"
          onClick={getThemeNavigationHandler("/app", targetTheme)}
          data-umami-event="Chat Now Clicked"
          className="dark:hidden bg-black text-[#FFC971] px-6 py-3 text-xl rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto w-fit cursor-pointer"
        >
          <div className="w-2 h-2 bg-[#FFC971] rounded-full"></div>
          Chat Now
        </a>
        {/* Dark mode button */}
        <div className="hidden dark:block mx-auto">
          <SparkleButton
            text="Chat Now"
            href="/app"
            onClick={getThemeNavigationHandler("/app", targetTheme)}
            dataUmamiEvent="Chat Now Clicked"
            className="text-xl"
          />
        </div>
      </div>
    </div>
  </section>
);

export default NiliaFeaturesSection;
