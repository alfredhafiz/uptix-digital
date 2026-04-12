"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          Something Went Wrong
        </h1>

        <p className="text-slate-400 mb-2">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>

        {process.env.NODE_ENV === "development" && error.message && (
          <p className="text-red-400 text-sm mb-8 font-mono bg-red-500/10 p-3 rounded-lg overflow-auto max-h-32">
            {error.message}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={reset}
            variant="outline"
            className="glass-card w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs text-slate-600">
            Error ID: {error.digest}
          </p>
        )}
      </motion.div>
    </div>
  );
}
