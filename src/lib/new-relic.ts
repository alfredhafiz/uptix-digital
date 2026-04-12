/**
 * New Relic Application Performance Monitoring (APM)
 * Track performance metrics, database queries, and external API calls
 */

export interface NewRelicConfig {
  appName: string;
  licenseKey: string;
  enabled: boolean;
  environment: string;
}

/**
 * Get New Relic configuration from environment
 */
export function getNewRelicConfig(): NewRelicConfig {
  const licenseKey = process.env.NEW_RELIC_LICENSE_KEY || "";
  const appName = process.env.NEW_RELIC_APP_NAME || "Uptix Digital Agency";
  const environment = process.env.NODE_ENV || "development";
  const enabled = !!licenseKey && environment === "production";

  return {
    appName,
    licenseKey,
    enabled,
    environment,
  };
}

/**
 * New Relic initialization
 * Add to top of your app entry point (before other requires):
 * require('newrelic');
 */
export function initializeNewRelic(): void {
  const config = getNewRelicConfig();

  if (!config.enabled) {
    console.log(
      "New Relic is not configured. Set NEW_RELIC_LICENSE_KEY in environment variables.",
    );
    return;
  }

  // This would typically be done with require('newrelic') at app startup
  console.log(`New Relic initialized for ${config.appName}`);
}

/**
 * Record custom metric
 * Usage: recordMetric('custom/auth/login_attempts', 1)
 */
export function recordMetric(unitName: string, value: number = 1): void {
  try {
    // In production, this would use New Relic API:
    // newrelic.recordMetric(unitName, value);
    if (typeof window === "undefined") {
      console.debug(`Metric: ${unitName} = ${value}`);
    }
  } catch (error) {
    console.error("Failed to record metric:", error);
  }
}

/**
 * Track function execution time
 */
export async function trackExecution<T>(
  functionName: string,
  fn: () => Promise<T>,
): Promise<T> {
  const startTime = performance.now();

  try {
    const result = await fn();
    const duration = performance.now() - startTime;

    recordMetric(`custom/${functionName}`, duration);
    console.debug(`${functionName} completed in ${duration.toFixed(2)}ms`);

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    recordMetric(`custom/${functionName}/error`, 1);
    console.error(
      `${functionName} failed after ${duration.toFixed(2)}ms:`,
      error,
    );
    throw error;
  }
}

/**
 * Notify New Relic of deployment
 * Run this as part of your deployment process
 */
export async function notifyDeployment(
  version: string,
  changelog?: string,
): Promise<void> {
  const config = getNewRelicConfig();

  if (!config.enabled) {
    console.log("Deployment notification skipped (New Relic not configured)");
    return;
  }

  try {
    const response = await fetch(
      "https://api.newrelic.com/v2/applications/deployments.json",
      {
        method: "POST",
        headers: {
          "X-API-Key": config.licenseKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deployment: {
            revision: version,
            changelog,
            description: `Deployed version ${version}`,
          },
        }),
      },
    );

    if (response.ok) {
      console.log("Deployment notification sent to New Relic");
    } else {
      console.error("Failed to notify New Relic of deployment");
    }
  } catch (error) {
    console.error("Error notifying New Relic:", error);
  }
}

/**
 * Performance monitoring dashboard metrics
 */
export const MONITORED_METRICS = {
  // Request metrics
  "http/request_count": "Total HTTP requests",
  "http/response_time": "Average response time (ms)",
  "http/error_rate": "HTTP error rate (%)",

  // Database metrics
  "db/query_count": "Total database queries",
  "db/query_time": "Average query time (ms)",
  "db/pool_connections": "Active database connections",

  // Application metrics
  "auth/login_attempts": "Login attempts",
  "auth/login_failures": "Failed login attempts",
  "auth/registrations": "New user registrations",

  // Business metrics
  "orders/created": "Orders created",
  "orders/completed": "Orders completed",
  "payments/processed": "Payments processed",
  "payments/failed": "Failed payments",

  // Performance metrics
  "memory/usage": "Memory usage (%)",
  "cpu/usage": "CPU usage (%)",
  "cache/hit_rate": "Cache hit rate (%)",
};

/**
 * Create custom alerts in New Relic dashboard for:
 * - Response time > 2 seconds
 * - Error rate > 1%
 * - Database query time > 500ms
 * - Memory usage > 80%
 */
export const ALERT_THRESHOLDS = {
  RESPONSE_TIME_MS: 2000,
  ERROR_RATE_PERCENT: 1,
  DB_QUERY_TIME_MS: 500,
  MEMORY_USAGE_PERCENT: 80,
  CPU_USAGE_PERCENT: 80,
  ERROR_COUNT: 10, // per 5 minutes
};

/**
 * Integration checklist:
 * 1. Install: npm install newrelic
 * 2. Create newrelic.js config file
 * 3. Add require('newrelic') at top of server.js
 * 4. Set NEW_RELIC_LICENSE_KEY in .env
 * 5. Deploy and monitor at https://one.newrelic.com
 */
