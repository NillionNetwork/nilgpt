"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";
import FAQSection from "@/components/landingPage/FAQSection";
import FeaturesSection from "@/components/landingPage/FeaturesSection";
import Footer from "@/components/landingPage/Footer";
import Header from "@/components/landingPage/Header";
import NiliaHeroSection from "@/components/landingPage/NiliaHeroSection";
import TestimonialSection from "@/components/landingPage/TestimonialSection";
import { captureAndStoreUTMParameters } from "@/utils/utmTracking";

export default function Nilia() {
  const { setTheme } = useTheme();

  // Force dark theme on this landing page
  useEffect(() => {
    setTheme("dark");
    sessionStorage.setItem("nilia", "true");
  }, [setTheme]);

  // Capture and store UTM parameters on landing page load
  useEffect(() => {
    const utmParams = captureAndStoreUTMParameters();
    if (Object.keys(utmParams).length > 0) {
      console.log("UTM parameters captured:", utmParams);
    }
  }, []);

  return (
    <main className="relative">
      <Header targetTheme="dark" />
      <NiliaHeroSection />
      <TestimonialSection />
      <FeaturesSection />
      <section
        style={{
          backgroundImage:
            "linear-gradient(to bottom, #1b1b1b 0%, #1b1b1b 40%, transparent 60%), url('/img/footer_gradient.webp')",
          backgroundSize: "100% 100%, 100% 100%",
          backgroundPosition: "top, bottom center",
          backgroundRepeat: "no-repeat, no-repeat",
        }}
      >
        <FAQSection />
        <Footer />
      </section>
    </main>
  );
}
