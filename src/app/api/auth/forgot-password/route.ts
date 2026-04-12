import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { z } from "zod";
import { randomUUID } from "crypto";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const validationResult = forgotPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 },
      );
    }

    const { email } = validationResult.data;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if user exists (security)
    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, you will receive password reset instructions.",
        },
        { status: 200 },
      );
    }

    // Generate reset token
    const resetToken = randomUUID();
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save reset token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: resetToken,
        expires: resetTokenExpiry,
      },
    });

    // Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #fff; padding: 40px; border-radius: 16px;">
        <h2 style="background: linear-gradient(135deg, #60a5fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 24px; margin-bottom: 24px;">
          Password Reset Request
        </h2>

        <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 24px;">
          We received a request to reset your password. Click the button below to create a new password.
        </p>

        <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #60a5fa, #a78bfa); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 24px 0;">
          Reset Password
        </a>

        <p style="color: #94a3b8; margin-top: 24px;">
          Or copy this link: <br/>
          <code style="background: rgba(255,255,255,0.1); padding: 8px 12px; border-radius: 4px; word-break: break-all;">${resetUrl}</code>
        </p>

        <p style="color: #94a3b8; margin-top: 24px; font-size: 14px;">
          This link will expire in 24 hours. If you didn't request this, you can safely ignore this email.
        </p>

        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
          <p style="font-size: 12px; color: #64748b;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: "Password Reset Request for Uptix Digital",
      html,
    });

    return NextResponse.json(
      {
        message:
          "If an account exists with this email, you will receive password reset instructions.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Failed to process request" },
      { status: 500 },
    );
  }
}
