"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function generateSessionId(): string {
  return (
    "s_" + Math.random().toString(36).substring(2) + Date.now().toString(36)
  );
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = sessionStorage.getItem("_track_sid");
  if (!sid) {
    sid = generateSessionId();
    sessionStorage.setItem("_track_sid", sid);
  }
  return sid;
}

export function PageTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string>("");

  useEffect(() => {
    // Skip tracking for admin/api routes
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/_next")
    ) {
      return;
    }

    // Prevent duplicate tracking for same path
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    const sessionId = getSessionId();

    // Send beacon – fire and forget
    const payload = JSON.stringify({
      path: pathname,
      referrer: document.referrer || null,
      sessionId,
    });

    // Use sendBeacon if available for reliability, fallback to fetch
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/track",
        new Blob([payload], { type: "application/json" }),
      );
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {
        // Tracking is non-critical
      });
    }
  }, [pathname]);

  return null;
}
