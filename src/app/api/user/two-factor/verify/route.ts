import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { verifyTOTPToken, enableTwoFactor } from "@/lib/two-factor-auth";
import { logAuditAction, AUDIT_ACTIONS } from "@/lib/audit-log";
import { getClientIP } from "@/lib/rate-limit";
import { z } from "zod";

const verifyTOTPSchema = z.object({
  token: z
    .string()
    .length(6, "Token must be 6 digits")
    .regex(/^\d+$/, "Token must be numeric"),
  secret: z.string().min(1, "Secret is required"),
  backupCodes: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate input
    const validationResult = verifyTOTPSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid token format" },
        { status: 400 },
      );
    }

    const { token, secret, backupCodes } = validationResult.data;

    // Verify TOTP token
    const isValid = verifyTOTPToken(secret, token);

    if (!isValid) {
      // Log failed attempt
      await logAuditAction({
        userId: session.user.id,
        action: "2FA_VERIFICATION_FAILED",
        entity: "User",
        entityId: session.user.id,
        status: "FAILED",
        reason: "Invalid TOTP token",
        ipAddress: getClientIP(req),
      });

      return NextResponse.json(
        { message: "Invalid token. Please try again." },
        { status: 400 },
      );
    }

    // Enable 2FA
    await enableTwoFactor(session.user.id, secret, backupCodes || []);

    // Log successful 2FA setup
    await logAuditAction({
      userId: session.user.id,
      action: "2FA_ENABLED",
      entity: "User",
      entityId: session.user.id,
      changes: { twoFactorEnabled: true },
      ipAddress: getClientIP(req),
      userAgent: req.headers.get("user-agent") || undefined,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Two-factor authentication enabled successfully",
        backupCodes,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("2FA verification error:", error);
    return NextResponse.json(
      { message: "Failed to verify 2FA" },
      { status: 500 },
    );
  }
}
