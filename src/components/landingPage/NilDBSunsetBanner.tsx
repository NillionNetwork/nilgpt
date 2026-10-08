"use client";

import type { ReactNode } from "react";

const NILDB_SUNSET_DATE = new Date("2026-10-23T00:00:00Z");

// Copies per half of the scrolling track, so it spans even very wide screens
const REPEAT_COUNT = 3;

const NilDBSunsetBanner = () => {
  const isBeforeSunset = Date.now() < NILDB_SUNSET_DATE.getTime();

  const message: ReactNode = isBeforeSunset ? (
    <>
      nilGPT now keeps your chats encrypted and private on your device, instead
      of in nilDB. Sign in before <strong>October 23</strong> to move your
      existing chats over.
    </>
  ) : (
    "nilGPT now keeps your chats encrypted and private on your device."
  );

  const half = Array.from({ length: REPEAT_COUNT }, (_, index) => (
    <span key={index} className="px-8">
      {message}
    </span>
  ));

  return (
    <div
      role="status"
      className="group w-full shrink-0 overflow-hidden bg-[#FFC971] py-3 text-sm font-medium text-black md:text-base"
    >
      {/* Scrolling ticker; the track holds two identical halves so the loop is seamless */}
      <div
        aria-hidden="true"
        className="flex w-max animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused] motion-reduce:hidden"
      >
        {half}
        {half}
      </div>

      {/* Static text for screen readers and users who prefer reduced motion */}
      <p className="sr-only px-4 text-center motion-reduce:not-sr-only">
        {message}
      </p>
    </div>
  );
};

export default NilDBSunsetBanner;
