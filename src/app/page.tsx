"use client";

import { Download } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import Footer from "@/components/landingPage/Footer";
import PWAInstallInstructionsModal from "@/components/PWAInstallInstructionsModal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import usePWAInstallInstructionsModal from "@/hooks/usePWAInstallInstructionsModal";
import { captureAndStoreUTMParameters } from "@/utils/utmTracking";
import FAQSection from "../components/landingPage/FAQSection";
import FeaturesSection from "../components/landingPage/FeaturesSection";
import Header from "../components/landingPage/Header";
import HeroSection from "../components/landingPage/HeroSection";
import TestimonialSection from "../components/landingPage/TestimonialSection";

export default function Home() {
  const { setTheme } = useTheme();
  const {
    shouldShowPWAInstallInstructionsModal,
    isPWAInstallInstructionsModalOpen,
    setIsPWAInstallInstructionsModalOpen,
  } = usePWAInstallInstructionsModal();

  // Force light theme on this landing page
  useEffect(() => {
    setTheme("light");
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
      <Header />
      <HeroSection />
      <TestimonialSection />
      <FeaturesSection />
      <FAQSection />
      <Footer />
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
