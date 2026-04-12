import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { smtpHost, smtpPort, smtpUser, smtpPass, fromEmail, fromName } =
      body;

    // Use provided values or fall back to DB / env
    const host = smtpHost || process.env.SMTP_HOST;
    const port = parseInt(smtpPort || process.env.SMTP_PORT || "587", 10);
    const user = smtpUser || process.env.SMTP_USER;
    const pass = smtpPass || process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      return NextResponse.json(
        {
          success: false,
          message: "SMTP host, user, and password are required.",
        },
        { status: 400 },
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    });

    // Verify the connection
    await transporter.verify();

    // Send a real test email to the admin
    await transporter.sendMail({
      from: `"${fromName || "Uptix Digital"}" <${fromEmail || user}>`,
      to: session.user.email!,
      subject: "SMTP Test - Uptix Digital",
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#0f172a;color:#fff;border-radius:12px;">
          <h2 style="color:#60a5fa;">✅ SMTP Connection Successful</h2>
          <p style="color:#94a3b8;">Your SMTP configuration is working correctly.</p>
          <p style="color:#64748b;font-size:13px;">Host: ${host}:${port}<br/>User: ${user}<br/>Sent at: ${new Date().toISOString()}</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully! Check your inbox.",
    });
  } catch (error: any) {
    console.error("SMTP test error:", error);
    const msg =
      error?.code === "ECONNREFUSED"
        ? "Connection refused – check host and port."
        : error?.code === "EAUTH"
          ? "Authentication failed – check username and password."
          : error?.message || "SMTP test failed.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
