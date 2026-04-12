import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

// Settings that should be persisted in database
const PERSISTENT_SETTINGS = [
  "siteName",
  "siteDescription",
  "logo",
  "favicon",
  "fromEmail",
  "fromName",
  "enableAnalytics",
  "googleAnalyticsId",
  "customHeadScripts",
  "customBodyScripts",
  "smtpHost",
  "smtpPort",
  "smtpUser",
];

// Settings that should only be in environment variables (sensitive)
const ENV_ONLY_SETTINGS = [
  "smtpPass",
  "stripePublicKey",
  "stripeSecretKey",
  "paypalClientId",
  "paypalClientSecret",
  "binanceApiKey",
  "binanceSecretKey",
];

// Helper to validate email or empty/null
const emailOrEmpty = z.union([
  z.string().email(),
  z.literal(""),
  z.null(),
  z.undefined(),
]);

const settingsSchema = z.object({
  siteName: z.string().min(1).max(100).optional(),
  siteDescription: z.string().max(500).optional(),
  logo: z.string().optional().nullable(),
  favicon: z.string().optional().nullable(),
  smtpHost: z.string().optional().nullable(),
  smtpPort: z
    .union([
      z.string().regex(/^\d+$/),
      z.number().int().positive(),
      z.literal(""),
      z.null(),
      z.undefined(),
    ])
    .optional(),
  smtpUser: emailOrEmpty,
  smtpPass: z.string().optional().nullable(),
  fromEmail: emailOrEmpty,
  fromName: z.string().max(100).optional().nullable(),
  stripePublicKey: z.string().optional().nullable(),
  stripeSecretKey: z.string().optional().nullable(),
  paypalClientId: z.string().optional().nullable(),
  paypalClientSecret: z.string().optional().nullable(),
  binanceApiKey: z.string().optional().nullable(),
  binanceSecretKey: z.string().optional().nullable(),
  googleAnalyticsId: z
    .union([
      z.string().regex(/^G-[A-Z0-9]{4,}$/i, "Invalid Google Analytics ID"),
      z.literal(""),
      z.null(),
      z.undefined(),
    ])
    .optional(),
  enableAnalytics: z.union([z.boolean(), z.string()]).optional(),
  customHeadScripts: z.union([z.string(), z.null()]).optional(),
  customBodyScripts: z.union([z.string(), z.null()]).optional(),
});

// Helper to get or create a setting
async function getOrCreateSetting(
  key: string,
  defaultValue: string = "",
): Promise<string> {
  const setting = await prisma.settings.findUnique({
    where: { key },
  });

  if (!setting) {
    await prisma.settings.create({
      data: {
        key,
        value: defaultValue,
        type: "string",
      },
    });
    return defaultValue;
  }

  return setting.value;
}

// Helper to update a setting
async function updateSetting(
  key: string,
  value: string,
  type: string = "string",
) {
  await prisma.settings.upsert({
    where: { key },
    update: { value, type },
    create: { key, value, type },
  });
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate input
    const validationResult = settingsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validationResult.error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 },
      );
    }

    const data = validationResult.data;

    // Convert empty strings to null for better storage
    const sanitizeValue = (val: any): string => {
      if (val === null || val === undefined) return "";
      if (typeof val === "boolean") return String(val);
      return String(val);
    };

    // Save persistent settings to database
    for (const key of PERSISTENT_SETTINGS) {
      const value = data[key as keyof typeof data];
      if (value !== undefined) {
        const type = typeof value === "boolean" ? "boolean" : "string";
        await updateSetting(key, sanitizeValue(value), type);
      }
    }

    // Log environment variable settings (they should be set in .env)
    const envSettings = ENV_ONLY_SETTINGS.filter(
      (key) => data[key as keyof typeof data] !== undefined,
    );

    if (envSettings.length > 0) {
      console.log("Environment variable settings to update:", {
        settings: envSettings,
        note: "These should be set in your .env file",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
      note:
        envSettings.length > 0
          ? "Some settings (payment keys, SMTP passwords) must be set in .env file for security"
          : undefined,
      savedSettings: PERSISTENT_SETTINGS.filter(
        (key) => data[key as keyof typeof data] !== undefined,
      ),
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      {
        message: "Failed to update settings",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get all persistent settings from database
    const dbSettings = await prisma.settings.findMany({
      where: {
        key: {
          in: PERSISTENT_SETTINGS,
        },
      },
    });

    // Convert to object
    const settings: Record<string, string | boolean> = {};

    for (const setting of dbSettings) {
      if (setting.type === "boolean") {
        settings[setting.key] = setting.value === "true";
      } else {
        settings[setting.key] = setting.value;
      }
    }

    // Add default values for missing settings
    if (!settings.siteName) settings.siteName = "Uptix Digital";
    if (!settings.siteDescription)
      settings.siteDescription = "Premium Web & App Development Agency";
    if (!settings.fromEmail) settings.fromEmail = "hello@uptixdigital.com";
    if (!settings.fromName) settings.fromName = "Uptix Digital";
    if (settings.enableAnalytics === undefined) settings.enableAnalytics = true;

    // Fallback to env if not stored in DB
    if (!settings.googleAnalyticsId)
      settings.googleAnalyticsId = process.env.GOOGLE_ANALYTICS_ID || "";
    if (!settings.smtpHost) settings.smtpHost = process.env.SMTP_HOST || "";
    if (!settings.smtpPort) settings.smtpPort = process.env.SMTP_PORT || "587";
    if (!settings.smtpUser) settings.smtpUser = process.env.SMTP_USER || "";
    if (!settings.customHeadScripts) settings.customHeadScripts = "";
    if (!settings.customBodyScripts) settings.customBodyScripts = "";

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { message: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}
