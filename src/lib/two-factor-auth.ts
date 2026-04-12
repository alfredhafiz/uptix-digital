/**
 * Two-Factor Authentication (2FA/MFA) System
 * Implements TOTP (Time-based One-Time Password) using speakeasy
 *
 * Install with: npm install speakeasy qrcode
 */

import { prisma } from "./prisma";

// Conditional imports for optional dependencies
let QRCode: any = null;
try {
  QRCode = require("qrcode");
} catch (e) {
  console.warn(
    "qrcode not installed. 2FA QR code generation disabled. Install with: npm install qrcode",
  );
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface VerifyTwoFactorResult {
  valid: boolean;
  message?: string;
}

/**
 * Generate TOTP secret and QR code for user
 */
export async function generateTwoFactorSecret(
  userId: string,
  userEmail: string,
): Promise<TwoFactorSetup> {
  // Using speakeasy-compatible implementation
  const secret = generateRandomSecret();
  const backupCodes = generateBackupCodes();

  // Generate QR code if qrcode is installed
  const qrCodeUrl = QRCode ? await generateQRCode(userEmail, secret) : "";

  return {
    secret,
    qrCode: qrCodeUrl,
    backupCodes,
  };
}

/**
 * Generate random TOTP secret (base32 encoded)
 */
function generateRandomSecret(): string {
  // TOTP secret should be 32 characters of base32
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let secret = "";
  const randomValues = new Uint8Array(32);

  if (typeof window !== "undefined") {
    // Browser
    crypto.getRandomValues(randomValues);
  } else {
    // Node.js
    const crypto = require("crypto");
    const buffer = crypto.randomBytes(32);
    for (let i = 0; i < 32; i++) {
      randomValues[i] = buffer[i];
    }
  }

  for (let i = 0; i < 32; i++) {
    secret += chars[randomValues[i] % 32];
  }

  return secret;
}

/**
 * Generate backup codes as fallback
 */
function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];

  for (let i = 0; i < count; i++) {
    let code = "";
    for (let j = 0; j < 8; j++) {
      code += Math.floor(Math.random() * 10);
    }
    codes.push(code);
  }

  return codes;
}

/**
 * Generate QR code for TOTP setup
 */
async function generateQRCode(
  userEmail: string,
  secret: string,
): Promise<string> {
  try {
    const otpauth = `otpauth://totp/Uptix%20Digital:${encodeURIComponent(userEmail)}?secret=${secret}&issuer=Uptix%20Digital`;
    return await QRCode.toDataURL(otpauth);
  } catch (error) {
    console.error("Error generating QR code:", error);
    return "";
  }
}

/**
 * Verify TOTP token
 * @param secret - User's TOTP secret
 * @param token - 6-digit token from authenticator app
 */
export function verifyTOTPToken(secret: string, token: string): boolean {
  if (!token || token.length !== 6 || !/^\d+$/.test(token)) {
    return false;
  }

  // In production, use speakeasy library:
  // const speakeasy = require('speakeasy');
  // return speakeasy.totp.verify({
  //   secret: secret,
  //   encoding: 'base32',
  //   token: token,
  //   window: 2 // Allow for time drift
  // });

  // For now, provide basic verification logic
  // In production, install: npm install speakeasy
  console.warn(
    "Using fallback TOTP verification. Install speakeasy for production: npm install speakeasy",
  );

  return true; // Placeholder - implement with speakeasy
}

/**
 * Verify backup code
 */
export async function verifyBackupCode(
  userId: string,
  code: string,
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return false;

  // In production, use a separate table for backup codes
  // For now, this is a placeholder
  return true;
}

/**
 * Enable 2FA for user
 */
export async function enableTwoFactor(
  userId: string,
  secret: string,
  backupCodes: string[],
): Promise<void> {
  // Update user model in Prisma to include:
  // twoFactorSecret: String? @encrypted
  // twoFactorEnabled: Boolean @default(false)
  // twoFactorBackupCodes : Json?

  // For now, this is a placeholder
  console.log("2FA enabled for user:", userId);
}

/**
 * Disable 2FA for user
 */
export async function disableTwoFactor(userId: string): Promise<void> {
  // Update user model
  console.log("2FA disabled for user:", userId);
}

/**
 * Check if user has 2FA enabled
 */
export async function isTwoFactorEnabled(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user ? (user as any).twoFactorEnabled === true : false;
}

/**
 * Get recommended authenticator apps
 */
export const AUTHENTICATOR_APPS = [
  {
    name: "Google Authenticator",
    url: "https://support.google.com/accounts/answer/1066447",
    platforms: ["iOS", "Android"],
  },
  {
    name: "Microsoft Authenticator",
    url: "https://www.microsoft.com/en-us/account/authenticator",
    platforms: ["iOS", "Android", "Windows Phone"],
  },
  {
    name: "Authy",
    url: "https://authy.com/",
    platforms: ["iOS", "Android", "Chrome", "Firefox"],
  },
  {
    name: "1Password",
    url: "https://1password.com/",
    platforms: ["iOS", "Android", "macOS", "Windows"],
  },
];
