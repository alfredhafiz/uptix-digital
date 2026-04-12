"use client";

import { SessionProvider } from "next-auth/react";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const refetchIntervalSeconds =
    process.env.NODE_ENV === "development" ? 10 : 30;

  return (
    <SessionProvider
      refetchInterval={refetchIntervalSeconds}
      refetchOnWindowFocus={true}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
}
