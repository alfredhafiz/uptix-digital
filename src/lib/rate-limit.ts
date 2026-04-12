/**
 * Rate Limiting Utility
 * Implements in-memory rate limiting for API endpoints
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Clean up expired entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

/**
 * Check if request is rate limited
 * @param key - Unique identifier (IP + endpoint, user ID, etc.)
 * @param limit - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns Object with { limited: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { limited: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // New entry or expired window
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      limited: false,
      remaining: limit - 1,
      resetTime: now + windowMs,
    };
  }

  // Increment existing entry
  entry.count++;

  const remaining = Math.max(0, limit - entry.count);
  const limited = entry.count > limit;

  return {
    limited,
    remaining,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client IP from request
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return ip;
}

/**
 * Create a rate limit response
 */
export function rateLimitResponse(
  remaining: number,
  resetTime: number,
  statusCode: number = 429,
): Response {
  const resetDate = new Date(resetTime).toISOString();
  return new Response(
    JSON.stringify({
      error: "Too many requests",
      message: "You have exceeded the rate limit. Please try again later.",
      retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
    }),
    {
      status: statusCode,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Limit": "5",
        "X-RateLimit-Remaining": Math.max(0, remaining).toString(),
        "X-RateLimit-Reset": resetDate,
        "Retry-After": Math.ceil((resetTime - Date.now()) / 1000).toString(),
      },
    },
  );
}
