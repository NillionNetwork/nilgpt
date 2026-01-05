"use client";

import Script from "next/script";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import Footer from "@/components/landingPage/Footer";
import Header from "@/components/landingPage/Header";
import NiliaFAQSection from "@/components/landingPage/NiliaFAQSection";
import NiliaFeaturesSection from "@/components/landingPage/NiliaFeaturesSection";
import NiliaHeroSection from "@/components/landingPage/NiliaHeroSection";
import NiliaTestimonialSection from "@/components/landingPage/NiliaTestimonialSection";
import { captureAndStoreUTMParameters } from "@/utils/utmTracking";

export default function Nilia() {
  const { setTheme } = useTheme();

  // Force dark theme on this landing page
  useEffect(() => {
    setTheme("dark");
    sessionStorage.setItem("nilia", "true");
    localStorage.setItem("nilia_user", "true");
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
      <NiliaTestimonialSection />
      <NiliaFeaturesSection />
      <section
        style={{
          backgroundImage:
            "linear-gradient(to bottom, #1b1b1b 0%, #1b1b1b 40%, transparent 60%), url('/img/footer_gradient.webp')",
          backgroundSize: "100% 100%, 100% 100%",
          backgroundPosition: "top, bottom center",
          backgroundRepeat: "no-repeat, no-repeat",
        }}
      >
        <NiliaFAQSection />
        <Footer />
      </section>
      <Script>
        {`!(function (w, d, t) {
            w.TiktokAnalyticsObject = t;
            var ttq = (w[t] = w[t] || []);
            (ttq.methods = [
              "page",
              "track",
              "identify",
              "instances",
              "debug",
              "on",
              "off",
              "once",
              "ready",
              "alias",
              "group",
              "enableCookie",
              "disableCookie",
              "holdConsent",
              "revokeConsent",
              "grantConsent",
            ]),
              (ttq.setAndDefer = function (t, e) {
                t[e] = function () {
                  t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
                };
              });
            for (var i = 0; i < ttq.methods.length; i++)
              ttq.setAndDefer(ttq, ttq.methods[i]);
            (ttq.instance = function (t) {
              for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++)
                ttq.setAndDefer(e, ttq.methods[n]);
              return e;
            }),
              (ttq.load = function (e, n) {
                var r = "https://analytics.tiktok.com/i18n/pixel/events.js",
                  o = n && n.partner;
                (ttq._i = ttq._i || {}),
                  (ttq._i[e] = []),
                  (ttq._i[e]._u = r),
                  (ttq._t = ttq._t || {}),
                  (ttq._t[e] = +new Date()),
                  (ttq._o = ttq._o || {}),
                  (ttq._o[e] = n || {});
                n = document.createElement("script");
                (n.type = "text/javascript"),
                  (n.async = !0),
                  (n.src = r + "?sdkid=" + e + "&lib=" + t);
                e = document.getElementsByTagName("script")[0];
                e.parentNode.insertBefore(n, e);
              });

            ttq.load("D59EDQ3C77U4D2G7UUPG");
            ttq.page();
          })(window, document, "ttq");`}
      </Script>
    </main>
  );
}
