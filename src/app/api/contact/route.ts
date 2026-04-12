import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import {
  checkRateLimit,
  getClientIP,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { RATE_LIMITS, CONTENT_LIMITS, ERROR_MESSAGES } from "@/lib/constants";
import { z } from "zod";

// Validation schema for contact form
const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(
      CONTENT_LIMITS.USER_NAME_MAX,
      `Name must be less than ${CONTENT_LIMITS.USER_NAME_MAX} characters`,
    ),
  email: z
    .string()
    .email("Invalid email address")
    .max(
      CONTENT_LIMITS.EMAIL_MAX,
      `Email must be less than ${CONTENT_LIMITS.EMAIL_MAX} characters`,
    ),
  service: z.string().max(50).optional(),
  budget: z.string().max(50).optional(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(
      CONTENT_LIMITS.CONTACT_MESSAGE_MAX,
      `Message must be less than ${CONTENT_LIMITS.CONTACT_MESSAGE_MAX} characters`,
    ),
});

export async function POST(req: Request) {
  try {
    // Rate limiting
    const clientIP = getClientIP(req);
    const rateLimitKey = `contact:${clientIP}`;
    const { limited, remaining, resetTime } = checkRateLimit(
      rateLimitKey,
      RATE_LIMITS.CONTACT_FORM.max,
      RATE_LIMITS.CONTACT_FORM.windowMs,
    );

    if (limited) {
      return rateLimitResponse(remaining, resetTime, 429);
    }

    const body = await req.json();

    // Validate input
    const validationResult = contactFormSchema.safeParse(body);
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

    const { name, email, service, budget, message } = validationResult.data;

    // Prepare email content
    const subject = `New Contact Form Submission from ${name}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #fff; padding: 40px; border-radius: 16px;">
        <h2 style="background: linear-gradient(135deg, #60a5fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 24px; margin-bottom: 24px;">
          New Contact Form Submission
        </h2>
        <table style="width: 100%; border-collapse: collapse; color: #94a3b8;">
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
            <td style="padding: 12px 0; font-weight: bold; color: #fff; width: 120px;">Name:</td>
            <td style="padding: 12px 0;">${escapeHtml(name)}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
            <td style="padding: 12px 0; font-weight: bold; color: #fff;">Email:</td>
            <td style="padding: 12px 0;">${escapeHtml(email)}</td>
          </tr>
          ${
            service
              ? `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
            <td style="padding: 12px 0; font-weight: bold; color: #fff;">Service:</td>
            <td style="padding: 12px 0;">${escapeHtml(service)}</td>
          </tr>
          `
              : ""
          }
          ${
            budget
              ? `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
            <td style="padding: 12px 0; font-weight: bold; color: #fff;">Budget:</td>
            <td style="padding: 12px 0;">${escapeHtml(budget)}</td>
          </tr>
          `
              : ""
          }
          <tr>
            <td style="padding: 12px 0; font-weight: bold; color: #fff; vertical-align: top;">Message:</td>
            <td style="padding: 12px 0; white-space: pre-wrap;">${escapeHtml(message)}</td>
          </tr>
        </table>
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
          <p style="font-size: 12px; color: #64748b;">
            This message was sent from the Uptix Digital contact form.
          </p>
        </div>
      </div>
    `;

    // Send email
    const result = await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@uptixdigital.com",
      subject,
      html,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Message sent successfully",
      });
    } else {
      console.error("Email sending failed:", result.error);
      // Still return success to user to avoid exposing internal errors
      // But log the error for debugging
      return NextResponse.json({
        success: true,
        message: "Message received",
      });
    }
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { message: "Failed to send message" },
      { status: 500 },
    );
  }
}

// Helper function to escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
