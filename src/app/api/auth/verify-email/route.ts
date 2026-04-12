import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      return NextResponse.json(
        { message: "Missing verification token or email" },
        { status: 400 },
      );
    }

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
        { message: "Invalid or expired verification link" },
        { status: 400 },
      );
    }

    // Update user email verification
    await prisma.user.update({
      where: { email },
      data: {
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
      { message: "Email verified successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { message: "Failed to verify email" },
      { status: 500 },
    );
  }
}
