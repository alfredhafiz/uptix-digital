import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  generateTwoFactorSecret,
  enableTwoFactor,
} from "@/lib/two-factor-auth";
import { logAuditAction, AUDIT_ACTIONS } from "@/lib/audit-log";
import { getClientIP } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Generate 2FA secret and QR code
    const twoFactorSetup = await generateTwoFactorSecret(
      session.user.id,
      session.user.email || "",
    );

    // Log action
    await logAuditAction({
      userId: session.user.id,
      action: AUDIT_ACTIONS.USER_PROFILE_UPDATE,
      entity: "User",
      entityId: session.user.id,
      changes: { twoFactorInitiated: true },
      ipAddress: getClientIP(req),
      userAgent: req.headers.get("user-agent") || undefined,
    });

    return NextResponse.json(
      {
        secret: twoFactorSetup.secret,
        qrCode: twoFactorSetup.qrCode,
        backupCodes: twoFactorSetup.backupCodes,
        message: "Scan the QR code with your authenticator app",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("2FA setup error:", error);
    return NextResponse.json(
      { message: "Failed to setup 2FA" },
      { status: 500 },
    );
  }
}
