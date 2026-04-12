import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    datasourceUrl: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Wrapper that retries a Prisma operation once on transient connection errors
 * (P1001 = can't reach server, P1017 = server closed connection).
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 1,
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isTransient =
      error?.code === "P1001" ||
      error?.code === "P1017" ||
      error?.message?.includes("Server has closed the connection");
    if (isTransient && retries > 0) {
      // Brief pause then reconnect
      await new Promise((r) => setTimeout(r, 500));
      try {
        await prisma.$disconnect();
      } catch {
        /* ignore */
      }
      return withRetry(fn, retries - 1);
    }
    throw error;
  }
}
