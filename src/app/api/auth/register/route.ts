import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  checkRateLimit,
  getClientIP,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { RATE_LIMITS, CONTENT_LIMITS, ERROR_MESSAGES } from "@/lib/constants";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registrationSchema = z
  .object({
    name: z
      .string()
      .min(CONTENT_LIMITS.USER_NAME_MIN)
      .max(CONTENT_LIMITS.USER_NAME_MAX),
    email: z.string().email().max(CONTENT_LIMITS.EMAIL_MAX),
    password: z
      .string()
      .min(CONTENT_LIMITS.PASSWORD_MIN)
      .max(CONTENT_LIMITS.PASSWORD_MAX),
    confirmPassword: z
      .string()
      .min(CONTENT_LIMITS.PASSWORD_MIN)
      .max(CONTENT_LIMITS.PASSWORD_MAX)
      .optional(),
  })
  .refine(
    (data) => !data.confirmPassword || data.password === data.confirmPassword,
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    },
  );

export async function POST(req: Request) {
  try {
    // Rate limiting
    const clientIP = getClientIP(req);
    const rateLimitKey = `register:${clientIP}`;
    const { limited, remaining, resetTime } = checkRateLimit(
      rateLimitKey,
      RATE_LIMITS.REGISTRATION.max,
      RATE_LIMITS.REGISTRATION.windowMs,
    );

    if (limited) {
      return rateLimitResponse(remaining, resetTime, 429);
    }

    const body = await req.json();

    // Validate input
    const validationResult = registrationSchema.safeParse(body);
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

    const { name, email, password } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CLIENT",
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: user.id,
        email: user.email,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: ERROR_MESSAGES.SERVER_ERROR },
      { status: 500 },
    );
  }
}
