"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-10 h-10 text-blue-400" />
        </div>

        <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>

        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>

        <p className="text-slate-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full glass-card">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </Link>

          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
