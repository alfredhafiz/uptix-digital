"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hoverText, setHoverText] = useState("");

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const isVisibleRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  // Smooth spring config
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
        if (!isVisibleRef.current) {
          isVisibleRef.current = true;
          setIsVisible(true);
        }
        rafRef.current = null;
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check for interactive elements
      const isButton = target.tagName === "BUTTON" || target.closest("button");
      const isLink = target.tagName === "A" || target.closest("a");
      const isCard =
        target.classList.contains("glass-card") ||
        target.closest(".glass-card");
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("input") ||
        target.closest("textarea");
      const isCursorPointer = target.classList.contains("cursor-pointer");
      const isClickable =
        target.classList.contains("clickable") || target.closest(".clickable");

      if (
        isButton ||
        isLink ||
        isCard ||
        isInput ||
        isCursorPointer ||
        isClickable
      ) {
        setIsHovering(true);

        // Get text content for the magnifier
        if (target.tagName === "BUTTON") {
          setHoverText(target.textContent?.slice(0, 2) || "");
        } else if (target.tagName === "A") {
          setHoverText("→");
        } else {
          setHoverText("🔍");
        }
      } else {
        setIsHovering(false);
        setHoverText("");
      }
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
      setIsHovering(false);
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseover", handleMouseOver);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY]);

  // Hide on mobile/touch devices
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches
  ) {
    return null;
  }

  return (
    <>
      {/* Normal Cursor Dot - shows when not hovering */}
      <motion.div
        className="fixed pointer-events-none z-[60]"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: "-50%",
          y: "-50%",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible && !isHovering ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <div
          className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
          style={{
            boxShadow:
              "0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)",
            willChange: "transform, opacity",
          }}
        />
      </motion.div>

      {/* Cursor Ring - shows when not hovering */}
      <motion.div
        className="fixed pointer-events-none z-[55]"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: "-50%",
          y: "-50%",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible && !isHovering ? 0.5 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <div className="w-8 h-8 rounded-full border border-blue-400/40" />
      </motion.div>

      {/* Transparent Magnifying Glass Cursor - shows when hovering on interactive elements */}
      <motion.div
        className="fixed pointer-events-none z-[70]"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: "-50%",
          y: "-50%",
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: isVisible && isHovering ? 1 : 0,
          scale: isVisible && isHovering ? 1 : 0.5,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
          mass: 0.5,
        }}
      >
        {/* Magnifier Handle */}
        <motion.div
          className="absolute -bottom-3 -right-3 w-8 h-2 bg-gradient-to-r from-blue-400/60 to-purple-500/60 rounded-full origin-left"
          style={{
            transform: "rotate(45deg)",
            boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
            backdropFilter: "blur(2px)",
          }}
          animate={{
            scale: isHovering ? 1 : 0,
          }}
          transition={{ delay: 0.05 }}
        />

        {/* Transparent Magnifier Container */}
        <motion.div
          className="relative flex items-center justify-center"
          animate={{
            width: isHovering ? 56 : 0,
            height: isHovering ? 56 : 0,
          }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300,
          }}
        >
          {/* Outer glass ring - semi-transparent */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
              backdropFilter: "blur(5px)",
              border: "2px solid rgba(255,255,255,0.3)",
              boxShadow: `
                  inset 0 1px 2px rgba(255,255,255,0.2),
                  0 4px 14px rgba(59, 130, 246, 0.16),
                  0 0 24px rgba(59, 130, 246, 0.08)
                `,
            }}
          />

          {/* Zoomed content area - shows element behind magnified */}
          <div
            className="absolute inset-1 rounded-full overflow-hidden"
            style={{
              background: "rgba(15, 23, 42, 0.3)",
              backdropFilter: "blur(1px)",
            }}
          >
            {/* This area is transparent - shows the zoomed element behind */}
          </div>

          {/* Magnification indicator lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 56 56"
          >
            {/* Crosshair lines */}
            <line
              x1="28"
              y1="10"
              x2="28"
              y2="18"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
            />
            <line
              x1="28"
              y1="38"
              x2="28"
              y2="46"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
            />
            <line
              x1="10"
              y1="28"
              x2="18"
              y2="28"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
            />
            <line
              x1="38"
              y1="28"
              x2="46"
              y2="28"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
            />

            {/* Center dot */}
            <circle cx="28" cy="28" r="2" fill="rgba(59, 130, 246, 0.6)" />
          </svg>

          {/* Glass reflection overlay */}
          <div
            className="absolute top-2 left-3 w-6 h-3 rounded-full pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.4), transparent)",
              transform: "rotate(-30deg)",
            }}
          />

          {/* Center magnifier icon/text */}
          <motion.span
            className="relative z-10 text-white text-sm font-bold drop-shadow-md"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0 }}
            transition={{ delay: 0.1 }}
          >
            {hoverText || "🔍"}
          </motion.span>

          {/* Outer glow ring */}
          <div
            className="absolute -inset-3 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 60%)",
              filter: "blur(4px)",
            }}
          />
        </motion.div>
      </motion.div>
    </>
  );
}
