"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getThemeNavigationHandler } from "@/utils/themeNavigation";

const HeroSection = () => {
  const [messageCount, setMessageCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessageCount = async () => {
      try {
        const response = await fetch("/api/message-count");
        const data = await response.json();

        if (data.success) {
          setMessageCount(data.count);
        } else {
          setMessageCount(null);
        }
      } catch (error) {
        console.error("Failed to fetch message count:", error);
        setMessageCount(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch immediately
    fetchMessageCount();

    // Set up interval to fetch every 30 seconds
    const interval = setInterval(fetchMessageCount, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-start bg-[#F7F6F2] overflow-visible pt-32 pb-12 md:pb-12">
      <div className="max-w-8xl w-full">
        <div className="grid md:grid-cols-2 items-start pt-2 md:pt-6">
          {/* Left Column - Text Content */}
          <div className="space-y-8 text-left pt-0 md:pt-6 2xl:pt-24 px-4 lg:px-10">
            <div className="space-y-4">
              <h1 className="font-display text-5xl lg:text-7xl font-normal text-black leading-tight">
                Meet nilGPT,
                <br />
                Your <span className="text-[#7C7C7A]">Totally Secure</span>
                <br />
                AI Companion
              </h1>
              <p className="text-lg md:text-2xl text-black pt-4">
                Others claim they are private, we prove that we are private.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-lg md:text-2xl text-black">
                All the functionality you need. All the privacy you deserve.
              </p>
            </div>

            {/* Image shown on mobile */}
            <div className="relative block md:hidden">
              <div className="w-full">
                <Image
                  src="/img/app_img.png"
                  alt="nilGPT interface"
                  width={1000}
                  height={700}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>

            {/* Message Counter */}
            <div className="flex justify-center md:justify-start mb-4">
              <div className="bg-white border-2 border-black rounded-full px-6 py-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-lg font-semibold text-black">
                    {isLoading
                      ? "Loading..."
                      : messageCount !== null
                        ? `${messageCount.toLocaleString()} messages secured`
                        : "Privacy active"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center md:justify-start md:mb-0">
              <a
                href="/app"
                onClick={getThemeNavigationHandler("/app", "light")}
                data-umami-event="Let's Chat Clicked"
                className="inline-flex items-center gap-2 bg-black text-xl text-[#FFC971] px-8 py-4 rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <div className="w-2 h-2 bg-[#FFC971] rounded-full"></div>
                Let&apos;s Chat
              </a>
            </div>
          </div>
          {/* Right Column - Image (hidden on mobile) */}
          <div className="relative hidden md:block">
            <div className="absolute right-100 top-0 w-[105%] 3xl:w-[90%]">
              <Image
                src="/img/app_img.png"
                alt="nilGPT interface"
                width={1000}
                height={660}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
          {/* <div className='relative hidden md:block'>
          <div className='absolute right-200 top-0 w-[110%] md:w-[110%] lg:w-[100%] xl:w-[90%]'>
            <Image
              src='/img/app_img.png'
              alt='nilGPT interface'
              width={1000}
              height={660}
              className='w-full h-auto max-h-[80vh] object-contain'
              priority
            />
          </div>
        </div> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
