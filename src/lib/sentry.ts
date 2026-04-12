/**
 * Sentry Error Tracking & Monitoring
 * Integrated error tracking, performance monitoring, and alerts
 *
 * Install with: npm install @sentry/nextjs
 */

let Sentry: any = null;
try {
  Sentry = require("@sentry/nextjs");
} catch (error) {
  const errorMsg = error instanceof Error ? error.message : String(error);
  if (errorMsg.includes("Cannot find module")) {
    // Sentry not installed - this is OK for optional feature
  } else {
    console.warn("Failed to load Sentry:", errorMsg);
  }
}

export interface SentryConfig {
  dsn: string;
  environment: string;
  tracesSampleRate: number;
  enabled: boolean;
}

/**
 * Get Sentry configuration from environment
 */
export function getSentryConfig(): SentryConfig {
  const dsn = process.env.SENTRY_DSN || "";
  const environment = process.env.NODE_ENV || "development";
  const enabled = !!dsn && environment === "production";

  return {
    dsn,
    environment,
    tracesSampleRate: 1.0, // Adjust based on volume
    enabled,
  };
}

/**
 * Initialize Sentry for Next.js
 * This should be called in the root layout or _app.tsx
 */
export function initializeSentry(): void {
  if (!Sentry) {
    console.log(
      "Sentry not available. Install with: npm install @sentry/nextjs",
    );
    return;
  }

  const config = getSentryConfig();

  if (!config.enabled) {
    console.log(
      "Sentry is not configured. Set SENTRY_DSN in environment variables.",
    );
    return;
  }

  try {
    Sentry.init({
      dsn: config.dsn,
      environment: config.environment,
      integrations: [
        Sentry.httpClientIntegration?.(),
        Sentry.nativeNodeFetchIntegration?.({ breadcrumbs: true }),
      ].filter(Boolean),
      tracesSampleRate: config.tracesSampleRate,
      debug: process.env.NODE_ENV === "development",
    });

    console.log("Sentry initialized for error tracking");
  } catch (error) {
    console.warn("Failed to initialize Sentry:", error);
  }
}

/**
 * Capture exception with context
 */
export function captureException(
  error: Error,
  context?: Record<string, any>,
): string {
  if (!Sentry) return "";

  if (context) {
    Sentry.setContext("custom", context);
  }

  return Sentry.captureException(error);
}

/**
 * Capture message
 */
export function captureMessage(
  message: string,
  level: "fatal" | "error" | "warning" | "info" | "debug" = "info",
): string {
  if (!Sentry) return "";
  return Sentry.captureMessage(message, level);
}

/**
 * Set user context for error tracking
 */
export function setUserContext(
  userId: string,
  email?: string,
  username?: string,
): void {
  if (!Sentry) return;
  Sentry.setUser({
    id: userId,
    email,
    username,
  });
}

/**
 * Clear user context when logging out
 */
export function clearUserContext(): void {
  if (!Sentry) return;
  Sentry.setUser(null);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  data?: Record<string, any>,
  level: "fatal" | "error" | "warning" | "info" | "debug" = "info",
): void {
  if (!Sentry) return;

  Sentry.addBreadcrumb({
    message,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Start performance transaction
 */
export function startTransaction(
  name: string,
  op: string = "http.request",
): any {
  if (!Sentry) return null;
  return Sentry.startTransaction({
    name,
    op,
  });
}

/**
 * Sentry error boundaries for React
 * Usage: Wrap components with <Sentry.ErrorBoundary>
 */
export const ErrorBoundary = Sentry?.ErrorBoundary || null;

/**
 * Error server action helper
 * Usage in API routes to capture and report errors
 */
export async function withErrorTracking<T>(
  fn: () => Promise<T>,
  context?: Record<string, any>,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    captureException(error as Error, context);
    throw error;
  }
}

/**
 * Configure alerts and thresholds
 * (This would typically be configured in Sentry dashboard)
 */
export const SENTRY_ALERTS = {
  ERROR_THRESHOLD: 5, // Alert if 5+ errors in 5 minutes
  PERFORMANCE_THRESHOLD: 3000, // Alert if requests exceed 3 seconds
  UPTIME_THRESHOLD: 99.5, // Alert if uptime drops below 99.5%
};

/**
 * Create custom alert rule
 * Example: Alert on specific error types or URLs
 */
export const SENTRY_CUSTOM_METRICS = {
  AUTHENTICATION_FAILURES: "auth.failures",
  PAYMENT_ERRORS: "payment.errors",
  DATABASE_QUERY_TIME: "db.query_time",
  API_RESPONSE_TIME: "api.response_time",
};
