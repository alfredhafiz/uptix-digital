import { z } from "zod";

// Define environment variable schema
const envSchema = z.object({
  // Database
  DATABASE_URL: z
    .string()
    .url("DATABASE_URL must be a valid PostgreSQL connection string"),
  DIRECT_URL: z
    .string()
    .url("DIRECT_URL must be a valid PostgreSQL connection string"),

  // Authentication
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),
  NEXTAUTH_SECRET: z
    .string()
    .min(32, "NEXTAUTH_SECRET must be at least 32 characters"),

  // Google OAuth (optional for development)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Email
  RESEND_API_KEY: z.string().optional(),
  ADMIN_EMAIL: z.string().email("ADMIN_EMAIL must be a valid email"),
  FROM_EMAIL: z.string().email("FROM_EMAIL must be a valid email"),
  FROM_NAME: z.string().min(1),

  // SMTP (optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  // Payment (optional for development)
  BINANCE_PAY_API_KEY: z.string().optional(),
  BINANCE_PAY_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLIC_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  PAYPAL_CLIENT_ID: z.string().optional(),
  PAYPAL_CLIENT_SECRET: z.string().optional(),

  // CORS
  ALLOWED_ORIGINS: z.string().default(""),

  // App Config
  SITE_NAME: z.string().optional(),
  SITE_DESCRIPTION: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL"),

  // Analytics
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  ENABLE_ANALYTICS: z.enum(["true", "false"]).optional(),

  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
});

type EnvConfig = z.infer<typeof envSchema>;

let env: EnvConfig | null = null;

/**
 * Validate and cache environment variables
 * Throws an error if validation fails
 */
export function getEnv(): EnvConfig {
  if (env) return env;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.errors
      .map((error) => `${error.path.join(".")}: ${error.message}`)
      .join("\n  ");

    throw new Error(
      `❌ Environment validation failed:\n  ${errors}\n\nPlease check your .env.local file.`,
    );
  }

  env = result.data;
  return env;
}

/**
 * Safe getter for environment variables with fallback
 */
export function getEnvVar(
  key: keyof typeof process.env,
  defaultValue?: string,
): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

// Validate on module load in production
if (typeof window === "undefined") {
  try {
    getEnv();
    console.log("✅ Environment variables validated successfully");
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      console.error(error);
      process.exit(1);
    } else {
      console.warn(error);
    }
  }
}
