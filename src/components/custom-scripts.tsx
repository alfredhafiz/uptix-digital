"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { sanitizeHTMLServer } from "@/lib/xss-protection";

export function CustomScripts() {
  const [headScripts, setHeadScripts] = useState("");
  const [bodyScripts, setBodyScripts] = useState("");
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    fetch("/api/public/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          if (typeof data.enableAnalytics === "boolean") {
            setAnalyticsEnabled(data.enableAnalytics);
          }
          if (data.customHeadScripts) {
            setHeadScripts(sanitizeHTMLServer(data.customHeadScripts));
          }
          if (data.customBodyScripts) {
            setBodyScripts(sanitizeHTMLServer(data.customBodyScripts));
          }
        }
      })
      .catch(() => {});
  }, []);

  // Extract GTM IDs from scripts for proper next/script integration
  const gtmMatch = headScripts.match(/GTM-[A-Z0-9]+/);
  const gtmId = gtmMatch ? gtmMatch[0] : null;

  if (!analyticsEnabled) {
    return null;
  }

  return (
    <>
      {/* Google Tag Manager via next/script for optimal loading */}
      {gtmId && (
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
          }}
        />
      )}

      {/* Custom head scripts (without GTM if already handled) */}
      {headScripts && !gtmId && (
        <Script
          id="custom-head-scripts"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: headScripts }}
        />
      )}

      {/* Custom body scripts */}
      {bodyScripts && (
        <Script
          id="custom-body-scripts"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{ __html: bodyScripts }}
        />
      )}
    </>
  );
}
