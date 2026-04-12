"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification:
      "The verification token has expired or has already been used.",
    OAuthSignin: "Error in the OAuth sign-in process.",
    OAuthCallback: "Error in the OAuth callback process.",
    OAuthCreateAccount: "Could not create OAuth provider account.",
    EmailCreateAccount: "Could not create email provider account.",
    Callback: "Error in the OAuth callback.",
    OAuthAccountNotLinked:
      "This email is already associated with another account.",
    EmailSignin: "Error sending the email sign-in link.",
    CredentialsSignin: "Invalid email or password. Please try again.",
    SessionRequired: "You must be signed in to access this page.",
    Default: "An unexpected error occurred during authentication.",
  };

  const errorMessage = errorMessages[error || ""] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-card border-white/10">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-red-500/10 rounded-full p-4 border border-red-500/20">
                  <AlertCircle className="w-10 h-10 text-red-400" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Authentication Error
              </CardTitle>
              <CardDescription className="text-slate-400">
                {errorMessage}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
                  Error Code:{" "}
                  <code className="bg-red-500/20 px-1 rounded">{error}</code>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Link href="/auth/login" className="w-full">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
              <Link href="/" className="w-full">
                <Button variant="outline" className="w-full glass-card">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
