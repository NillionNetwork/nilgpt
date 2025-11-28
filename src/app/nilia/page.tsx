"use client";

import { Download } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import FAQSection from "@/components/landingPage/FAQSection";
import FeaturesSection from "@/components/landingPage/FeaturesSection";
import Footer from "@/components/landingPage/Footer";
import Header from "@/components/landingPage/Header";
import NiliaHeroSection from "@/components/landingPage/NiliaHeroSection";
import TestimonialSection from "@/components/landingPage/TestimonialSection";
import PWAInstallInstructionsModal from "@/components/PWAInstallInstructionsModal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import usePWAInstallInstructionsModal from "@/hooks/usePWAInstallInstructionsModal";
import { captureAndStoreUTMParameters } from "@/utils/utmTracking";

export default function Nilia() {
  const { setTheme } = useTheme();
  const {
    shouldShowPWAInstallInstructionsModal,
    isPWAInstallInstructionsModalOpen,
    setIsPWAInstallInstructionsModalOpen,
  } = usePWAInstallInstructionsModal();

  // Force dark theme on this landing page
  useEffect(() => {
    setTheme("dark");
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
      <FeaturesSection targetTheme="dark" />
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

      {shouldShowPWAInstallInstructionsModal && (
        <Dialog
          open={isPWAInstallInstructionsModalOpen}
          onOpenChange={setIsPWAInstallInstructionsModalOpen}
        >
          <DialogTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="bg-[#FFC971] rounded-full gap-2 px-4 my-4 hover:bg-[#FFC971]/90 fixed bottom-4 right-4"
            >
              <Download className="text-black" size={16} />
              <span className="text-sm text-black">Install nilGPT</span>
            </Button>
          </DialogTrigger>
          <PWAInstallInstructionsModal />
        </Dialog>
      )}
    </main>
  );
}
