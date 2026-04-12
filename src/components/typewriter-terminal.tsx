"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TerminalLine {
  text: string;
  color?: string;
  delay?: number;
  typeSpeed?: number;
}

interface LanguageSession {
  name: string;
  icon: string;
  lines: TerminalLine[];
}

const languageSessions: LanguageSession[] = [
  {
    name: "TypeScript",
    icon: "⌘",
    lines: [
      {
        text: "$ npm create uptix-project@latest",
        color: "text-green-400",
        delay: 0,
        typeSpeed: 30,
      },
      { text: "", color: "", delay: 200 },
      {
        text: "? Project name: ",
        color: "text-slate-400",
        delay: 0,
        typeSpeed: 15,
      },
      { text: "my-awesome-app", color: "text-white", delay: 0, typeSpeed: 30 },
      { text: "", color: "", delay: 300 },
      {
        text: "? Select framework: ",
        color: "text-slate-400",
        delay: 0,
        typeSpeed: 15,
      },
      { text: "Next.js 15", color: "text-yellow-400", delay: 0, typeSpeed: 20 },
      { text: "", color: "", delay: 200 },
      {
        text: "? Add TypeScript? ",
        color: "text-slate-400",
        delay: 0,
        typeSpeed: 15,
      },
      { text: "Yes", color: "text-green-400", delay: 0, typeSpeed: 20 },
      { text: "", color: "", delay: 200 },
      {
        text: "? Add Tailwind CSS? ",
        color: "text-slate-400",
        delay: 0,
        typeSpeed: 15,
      },
      { text: "Yes", color: "text-green-400", delay: 0, typeSpeed: 20 },
      { text: "", color: "", delay: 500 },
      {
        text: "✓ Project initialized successfully!",
        color: "text-green-400",
        delay: 0,
        typeSpeed: 25,
      },
      { text: "", color: "", delay: 300 },
      {
        text: "→ cd my-awesome-app",
        color: "text-slate-500",
        delay: 0,
        typeSpeed: 20,
      },
      { text: "", color: "", delay: 200 },
      {
        text: "→ npm run dev",
        color: "text-slate-500",
        delay: 0,
        typeSpeed: 20,
      },
      { text: "", color: "", delay: 800 },
      {
        text: "ready - started server on 0.0.0.0:3000",
        color: "text-blue-400",
        delay: 0,
        typeSpeed: 20,
      },
    ],
  },
  {
    name: "Python",
    icon: "🐍",
    lines: [
      {
        text: "$ python3 -m venv uptix-env",
        color: "text-green-400",
        delay: 0,
        typeSpeed: 30,
      },
      { text: "", color: "", delay: 300 },
      {
        text: "$ source uptix-env/bin/activate",
        color: "text-green-400",
        delay: 0,
        typeSpeed: 30,
      },
      {
        text: "(uptix-env) $ pip install fastapi uvicorn",
        color: "text-blue-400",
        delay: 0,
        typeSpeed: 25,
      },
      { text: "", color: "", delay: 500 },
      {
        text: "Collecting fastapi",
        color: "text-slate-400",
        delay: 0,
        typeSpeed: 20,
      },
      {
        text: "Collecting uvicorn",
        color: "text-slate-400",
        delay: 100,
        typeSpeed: 20,
      },
      {
        text: "Installing collected packages...",
        color: "text-slate-400",
        delay: 200,
        typeSpeed: 20,
      },
      {
        text: "Successfully installed",
        color: "text-green-400",
        delay: 300,
        typeSpeed: 25,
      },
      { text: "", color: "", delay: 300 },
      {
        text: "(uptix-env) $ python main.py",
        color: "text-green-400",
        delay: 0,
        typeSpeed: 30,
      },
      { text: "", color: "", delay: 400 },
      {
        text: "INFO:     Uvicorn running on http://0.0.0.0:8000",
        color: "text-purple-400",
        delay: 0,
        typeSpeed: 20,
      },
      {
        text: "INFO:     Application startup complete.",
        color: "text-blue-400",
        delay: 100,
        typeSpeed: 20,
      },
    ],
  },
  {
    name: "React Native",
    icon: "⚛️",
    lines: [
      {
        text: "$ npx react-native init UptixMobile",
        color: "text-green-400",
        delay: 0,
        typeSpeed: 30,
      },
      { text: "", color: "", delay: 400 },
      {
        text: "✔ Downloading template",
        color: "text-blue-400",
        delay: 0,
        typeSpeed: 20,
      },
      {
        text: "✔ Copying template",
        color: "text-blue-400",
        delay: 150,
        typeSpeed: 20,
      },
      {
        text: "✔ Processing template",
        color: "text-blue-400",
        delay: 150,
        typeSpeed: 20,
      },
      {
        text: "✔ Installing dependencies",
        color: "text-blue-400",
        delay: 200,
        typeSpeed: 20,
      },
      { text: "", color: "", delay: 300 },
      {
        text: "cd UptixMobile",
        color: "text-slate-500",
        delay: 0,
        typeSpeed: 20,
      },
      { text: "", color: "", delay: 200 },
      {
        text: "npx react-native run-ios",
        color: "text-green-400",
        delay: 0,
        typeSpeed: 25,
      },
      { text: "", color: "", delay: 600 },
      {
        text: "info Installing build dependencies...",
        color: "text-slate-400",
        delay: 0,
        typeSpeed: 20,
      },
      {
        text: "success Build successful!",
        color: "text-green-400",
        delay: 400,
        typeSpeed: 25,
      },
      { text: "", color: "", delay: 200 },
      {
        text: "✓ App launched on iPhone 15 Pro",
        color: "text-purple-400",
        delay: 0,
        typeSpeed: 20,
      },
    ],
  },
  {
    name: "Go",
    icon: "🚀",
    lines: [
      {
        text: "$ go mod init github.com/uptix/api",
        color: "text-cyan-400",
        delay: 0,
        typeSpeed: 30,
      },
      {
        text: "go: creating new go.mod",
        color: "text-slate-400",
        delay: 200,
        typeSpeed: 20,
      },
      { text: "", color: "", delay: 200 },
      {
        text: "$ go get github.com/gin-gonic/gin",
        color: "text-cyan-400",
        delay: 0,
        typeSpeed: 30,
      },
      { text: "", color: "", delay: 400 },
      {
        text: "go: downloading github.com/gin-gonic/gin",
        color: "text-slate-400",
        delay: 0,
        typeSpeed: 20,
      },
      {
        text: "go: downloading dependencies...",
        color: "text-slate-400",
        delay: 150,
        typeSpeed: 20,
      },
      { text: "", color: "", delay: 300 },
      {
        text: "$ go build -o api-server",
        color: "text-cyan-400",
        delay: 0,
        typeSpeed: 30,
      },
      { text: "", color: "", delay: 500 },
      {
        text: "$ ./api-server",
        color: "text-green-400",
        delay: 0,
        typeSpeed: 25,
      },
      { text: "", color: "", delay: 300 },
      {
        text: "[GIN] 2024/01/15 - 10:30:00 | 200 |     1.2ms |       ::1 | GET     /api/health",
        color: "text-green-400",
        delay: 0,
        typeSpeed: 15,
      },
      {
        text: "[GIN] Listening on :8080",
        color: "text-blue-400",
        delay: 100,
        typeSpeed: 20,
      },
    ],
  },
];

// Spinning Electron Icon Component
function SpinningElectron() {
  return (
    <motion.div
      className="relative w-5 h-5"
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      {/* Electron orbits */}
      <svg viewBox="0 0 24 24" className="w-full h-full">
        {/* Nucleus */}
        <circle cx="12" cy="12" r="2" fill="#60a5fa" />

        {/* Orbit 1 */}
        <ellipse
          cx="12"
          cy="12"
          rx="9"
          ry="4"
          fill="none"
          stroke="url(#gradient1)"
          strokeWidth="1"
          opacity="0.6"
        />

        {/* Orbit 2 - rotated */}
        <ellipse
          cx="12"
          cy="12"
          rx="9"
          ry="4"
          fill="none"
          stroke="url(#gradient2)"
          strokeWidth="1"
          opacity="0.6"
          transform="rotate(60 12 12)"
        />

        {/* Orbit 3 - rotated */}
        <ellipse
          cx="12"
          cy="12"
          rx="9"
          ry="4"
          fill="none"
          stroke="url(#gradient3)"
          strokeWidth="1"
          opacity="0.6"
          transform="rotate(120 12 12)"
        />

        {/* Electrons */}
        <circle cx="21" cy="12" r="1.5" fill="#f472b6">
          <animate
            attributeName="opacity"
            values="1;0.5;1"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx="12"
          cy="16"
          r="1.5"
          fill="#a78bfa"
          transform="rotate(60 12 12)"
        >
          <animate
            attributeName="opacity"
            values="0.5;1;0.5"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx="12"
          cy="8"
          r="1.5"
          fill="#60a5fa"
          transform="rotate(120 12 12)"
        >
          <animate
            attributeName="opacity"
            values="1;0.5;1"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Gradients */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

// Glitch animation variants
const glitchVariants = {
  hidden: {
    opacity: 0,
    x: -10,
    filter: "blur(10px)",
  },
  visible: {
    opacity: [0, 1, 0.8, 1, 0.9, 1],
    x: [-10, 5, -3, 2, 0, 0],
    filter: [
      "blur(10px)",
      "blur(0px)",
      "blur(2px)",
      "blur(0px)",
      "blur(1px)",
      "blur(0px)",
    ],
    transition: {
      duration: 0.6,
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      ease: "easeOut",
    },
  },
};

const lineGlitchVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: [0, 1, 0.5, 1],
    x: [-20, 10, -5, 0],
    transition: {
      duration: 0.4,
      delay: i * 0.05,
      times: [0, 0.3, 0.6, 1],
    },
  }),
};

export function TypewriterTerminal() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const currentSession = languageSessions[currentSessionIndex];
  const terminalLines = currentSession.lines;
  const sessionComplete = currentLineIndex >= terminalLines.length;

  useEffect(() => {
    // Glitch effect on first render
    const glitchTimer = setTimeout(() => {
      setIsFirstRender(false);
      setIsTyping(true);
    }, 800);
    return () => clearTimeout(glitchTimer);
  }, []);

  useEffect(() => {
    if (!isTyping || isFirstRender) return;

    if (sessionComplete) {
      const timer = setTimeout(() => {
        setCurrentSessionIndex((prev) => (prev + 1) % languageSessions.length);
        setCurrentLineIndex(0);
        setCurrentCharIndex(0);
        setDisplayedLines([]);
      }, 3000);
      return () => clearTimeout(timer);
    }

    const currentLine = terminalLines[currentLineIndex];

    if (!currentLine.text) {
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, ""]);
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, currentLine.delay || 100);
      return () => clearTimeout(timer);
    }

    if (currentCharIndex < currentLine.text.length) {
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => {
          const newLines = [...prev];
          if (newLines.length <= currentLineIndex) {
            newLines.push(currentLine.text.substring(0, currentCharIndex + 1));
          } else {
            newLines[currentLineIndex] = currentLine.text.substring(
              0,
              currentCharIndex + 1,
            );
          }
          return newLines;
        });
        setCurrentCharIndex((prev) => prev + 1);
      }, currentLine.typeSpeed || 20);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, currentLine.delay || 100);
      return () => clearTimeout(timer);
    }
  }, [
    currentLineIndex,
    currentCharIndex,
    isTyping,
    isFirstRender,
    currentSessionIndex,
    terminalLines,
    sessionComplete,
  ]);

  return (
    <div className="font-mono text-sm h-full flex flex-col">
      {/* Header - Language top left, Session top right (SWAPPED) */}
      <div className="flex items-center justify-between mb-4">
        {/* Language icon + name - top left, no background */}
        <motion.div
          className="inline-flex items-center space-x-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-xl">{currentSession.icon}</span>
          <span className="text-white font-semibold">
            {currentSession.name}
          </span>
        </motion.div>

        {/* Session indicator - top right */}
        <motion.div
          className="text-slate-500 text-xs"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          Session {currentSessionIndex + 1}/{languageSessions.length}
        </motion.div>
      </div>

      {/* Terminal Content - Fixed height container that doesn't shrink */}
      <div className="flex-1 min-h-[320px] max-h-[320px] overflow-hidden relative">
        <AnimatePresence mode="wait">
          {isFirstRender ? (
            // Glitch effect on first render
            <motion.div
              key="glitch"
              className="absolute inset-0"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
            >
              {terminalLines.slice(0, 8).map((line, index) => (
                <motion.div
                  key={`glitch-${index}`}
                  custom={index}
                  variants={lineGlitchVariants}
                  className={`${line.color || "text-slate-400"} h-5 leading-5 opacity-50`}
                >
                  {line.text}
                </motion.div>
              ))}
              <motion.div
                className="mt-4 text-blue-400"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                Initializing...
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key={currentSessionIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              {terminalLines.map((line, index) => {
                if (index > currentLineIndex) {
                  return <div key={index} className="h-5" />;
                }

                const isCurrentLine =
                  index === currentLineIndex && !sessionComplete;
                const displayText = displayedLines[index] || "";

                return (
                  <motion.div
                    key={index}
                    className={`${line.color || "text-slate-400"} h-5 leading-5`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1 }}
                  >
                    {line.text.startsWith("?") && (
                      <span className="text-blue-400">? </span>
                    )}
                    {line.text.startsWith("→") && (
                      <span className="text-blue-400">→ </span>
                    )}
                    {displayText.replace(/^[?→]\s*/, "")}
                    {isCurrentLine && isTyping && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="inline-block w-2 h-4 bg-blue-400 ml-0.5 align-middle"
                      />
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Bar - Spinning electron at bottom left when typing, session dots at right */}
      <motion.div
        className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {/* Bottom left - Spinning electron when typing, otherwise status text - CHANGED "Typing" to "Reasoning" */}
        <div className="flex items-center gap-2">
          {!sessionComplete && isTyping ? (
            <>
              <SpinningElectron />
              <span className="text-blue-400">Reasoning...</span>
            </>
          ) : sessionComplete ? (
            <span className="text-green-400 flex items-center gap-1">
              <span>✓</span>
              <span>Complete</span>
            </span>
          ) : (
            <span className="text-slate-500">Ready</span>
          )}
        </div>

        {/* Session progress dots - bottom right */}
        <div className="flex gap-2">
          {languageSessions.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === currentSessionIndex ? "bg-blue-400" : "bg-slate-600"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
