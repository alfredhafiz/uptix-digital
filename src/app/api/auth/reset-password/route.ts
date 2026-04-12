import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { CONTENT_LIMITS, ERROR_MESSAGES } from "@/lib/constants";

const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(CONTENT_LIMITS.PASSWORD_MIN)
      .max(CONTENT_LIMITS.PASSWORD_MAX),
    confirmPassword: z
      .string()
      .min(CONTENT_LIMITS.PASSWORD_MIN)
      .max(CONTENT_LIMITS.PASSWORD_MAX),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const validationResult = resetPasswordSchema.safeParse(body);
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

    const { token, email, password } = validationResult.data;

    // Verify token exists and is not expired
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: email,
          token,
        },
      },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return NextResponse.json(
        {
          message:
            "Invalid or expired reset link. Please request a new password reset.",
        },
        { status: 400 },
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        emailVerified: new Date(),
      },
    });

    // Delete used token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token,
        },
      },
    });

    return NextResponse.json(
      {
        message:
          "Password reset successfully. You can now log in with your new password.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: ERROR_MESSAGES.SERVER_ERROR },
      { status: 500 },
    );
  }
}
