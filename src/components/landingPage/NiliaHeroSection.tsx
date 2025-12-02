"use client";

import Image from "next/image";
import SparkleButton from "@/components/ui/SparkleButton";
import { getThemeNavigationHandler } from "@/utils/themeNavigation";

export default function NiliaHeroSection() {
  return (
    <section className="relative w-full flex flex-col items-center px-4 pt-28 pb-32 md:pt-40 md:pb-48 overflow-hidden">
      {/* Background Gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, transparent 0%, transparent 40%, #1b1b1b 100%), url('/img/hero_gradient_three.webp')",
          backgroundSize: "100% 100%, 100% 100%",
          backgroundPosition: "top, center",
          backgroundRepeat: "no-repeat, no-repeat",
        }}
      />
      {/* Announcement Badge */}
      <div className="mb-6 flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm">
        <span className="text-white/80">✦</span>
        <span className="text-white/90">Meet Nilia</span>
        <span className="rounded bg-white/20 px-2 py-0.5 text-xs font-medium text-white">
          NEW
        </span>
      </div>

      {/* Headline */}
      <h1 className="mb-6 text-center font-display text-5xl lg:text-6xl font-medium tracking-tight text-white md:text-5xl lg:text-6xl">
        Your Safe Space To Think
      </h1>

      {/* Subtext */}
      <p className="mb-8 max-w-md text-center text-base text-white/70 md:max-w-2xl md:text-lg">
        A private place to think out loud, find clarity, and feel understood —
        without being watched, tracked, or analyzed.
      </p>

      {/* CTA Button */}
      <SparkleButton
        text="Go To Your Safe Space"
        href="/app"
        onClick={getThemeNavigationHandler("/app", "dark")}
        dataUmamiEvent="Let's Chat Clicked - Nilia"
        className="mb-12 md:mb-16 plausible-event-name=Let's+Chat+Clicked+-+Nilia"
      />

      {/* Chat Preview Mockup */}
      <div className="w-full max-w-4xl">
        <Image
          src={"/img/hero_image_nilia.png"}
          alt="nilGPT chat interface preview"
          width={1200}
          height={750}
          className="h-auto w-full rounded-xl shadow-2xl"
          priority
        />
      </div>
    </section>
  );
}
