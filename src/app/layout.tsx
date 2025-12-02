import type { Metadata } from "next";
import Script from "next/script";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import { Toaster } from "@/components/ui/sonner";
import ThemeProvider from "@/providers/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "nilGPT - Private LLM Chat",
  description:
    "nilGPT gives you all the functionality and all the privacy. Your totally secure AI workflow.",
  metadataBase: new URL("https://nilgpt.xyz"),
  manifest: "/manifest.json",
  openGraph: {
    title: "nilGPT - Private LLM Chat",
    description:
      "nilGPT gives you all the functionality and all the privacy. Your totally secure AI workflow.",
    url: "https://nilgpt.xyz",
    siteName: "nilGPT",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "nilGPT - Private LLM Chat",
    description:
      "nilGPT gives you all the functionality and all the privacy. Your totally secure AI workflow.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased">
        <ThemeProvider>
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
      <Script
        async
        src="https://cloud.umami.is/script.js"
        data-website-id="4f63bc18-938c-46f0-a0c1-873a43098e28"
      />
      <Script
        async
        src="https://cloud.umami.is/script.js"
        data-website-id="5e52f8b8-ca50-4a36-af8a-91b57f0b27b6"
        data-auto-track="false"
      />
      <ServiceWorkerRegistration />
    </html>
  );
}
