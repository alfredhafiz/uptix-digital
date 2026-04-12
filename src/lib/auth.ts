import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma, withRetry } from "./prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    newUser: "/auth/register",
  },
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    // Credentials Provider
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            // Return null with generic message - don't reveal if email exists
            return null;
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            // Generic error - don't reveal user existence
            return null;
          }

          if (!user.password) {
            // Generic error - don't reveal authentication method
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isPasswordValid) {
            // Generic error
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          };
        } catch (error) {
          console.error("[AUTH] Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Handle Google OAuth sign in
      if (account?.provider === "google") {
        try {
          // Check if user exists
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!dbUser) {
            // Create new user from Google OAuth
            dbUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                role: "CLIENT", // Default role for OAuth users
                emailVerified: new Date(),
              },
            });
            if (process.env.NODE_ENV === "development") {
              console.log(
                "[AUTH] New user created from Google OAuth:",
                user.email,
              );
            }
          }

          // Update user object with database values
          user.id = dbUser.id;
          user.role = dbUser.role;
          user.image = dbUser.image;
        } catch (error) {
          console.error("[AUTH] Google sign in error:", error);
          return false;
        }
      }

      return true;
    },
    async session({ token, session }) {
      try {
        if (session?.user && token?.email) {
          session.user.id = (token.id as string) || "";
          session.user.name = (token.name as string) || "";
          session.user.email = token.email as string;
          session.user.image = (token.picture as string) || "";
          session.user.role = (token.role as "ADMIN" | "CLIENT") || "CLIENT";
        }

        return session;
      } catch (error) {
        console.error("[AUTH] Session callback error:", error);
        return session;
      }
    },
    async jwt({ token, user, trigger, session }) {
      try {
        const now = Date.now();
        const tokenWithSync = token as typeof token & { lastSync?: number };
        const normalizePicture = (value: unknown) => {
          if (typeof value !== "string") return null;
          if (value.startsWith("data:")) return null;
          if (value.length > 500) return null;
          return value;
        };

        // Initial sign in
        if (user) {
          return {
            id: user.id,
            name: user.name || null,
            email: user.email,
            picture: normalizePicture(user.image),
            role: user.role || "CLIENT",
            lastSync: now,
          };
        }

        // Handle session update
        if (trigger === "update" && session?.user) {
          return {
            ...token,
            name: session.user.name ?? token.name,
            email: session.user.email ?? token.email,
            picture: normalizePicture(session.user.image) ?? token.picture,
            role: session.user.role ?? token.role,
            lastSync: now,
          };
        }

        // Periodically refresh role/profile from database (avoid DB query on every request)
        const REFRESH_INTERVAL_MS =
          process.env.NODE_ENV === "development" ? 30_000 : 60_000;
        const shouldRefresh =
          !tokenWithSync.lastSync ||
          now - tokenWithSync.lastSync > REFRESH_INTERVAL_MS;

        if (token.email && shouldRefresh) {
          try {
            const dbUser = await withRetry(() =>
              prisma.user.findUnique({
                where: {
                  email: token.email as string,
                },
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                  role: true,
                },
              }),
            );

            if (dbUser) {
              return {
                id: dbUser.id,
                name: dbUser.name || null,
                email: dbUser.email,
                picture: normalizePicture(dbUser.image),
                role: dbUser.role || "CLIENT",
                lastSync: now,
              };
            }

            return {
              ...token,
              lastSync: now,
            };
          } catch (dbError) {
            console.error("[AUTH] Database error in JWT:", dbError);
            // Return existing token on DB error
            return token;
          }
        }

        return token;
      } catch (error) {
        console.error("[AUTH] JWT callback error:", error);
        return token;
      }
    },
  },
  events: {
    async signIn({ user }) {
      if (process.env.NODE_ENV === "development") {
        console.log("[AUTH] User signed in:", user?.email);
      }
    },
    async signOut({ token }) {
      if (process.env.NODE_ENV === "development") {
        console.log("[AUTH] User signed out:", token?.email);
      }
    },
  },
  debug: false, // Disabled to reduce console spam
};

// Helper function for server components
export const auth = async () => {
  try {
    const { getServerSession } = await import("next-auth/next");
    const session = await getServerSession(authOptions);
    return session;
  } catch (error) {
    console.error("[AUTH] Auth helper error:", error);
    return null;
  }
};

// For API routes
export { authOptions as config };
