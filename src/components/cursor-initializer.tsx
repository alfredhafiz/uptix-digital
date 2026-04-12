"use client";

import { useEffect } from "react";
import { initEnhancedCursor } from "@/lib/cursor-enhanced";

export function CursorInitializer() {
  useEffect(() => {
    const shouldEnable =
      process.env.NEXT_PUBLIC_ENABLE_CUSTOM_CURSOR !== "false";

    if (!shouldEnable) {
      return;
    }

    const cleanup = initEnhancedCursor();

    if (!cleanup) {
      document.documentElement.classList.remove("enhanced-cursor-enabled");
      return;
    }

    document.documentElement.classList.add("enhanced-cursor-enabled");

    return () => {
      document.documentElement.classList.remove("enhanced-cursor-enabled");
      cleanup?.();
    };
  }, []);

  return null;
}
