import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Lightweight user-agent parser
function parseUA(ua: string) {
  let browser = "Unknown";
  let os = "Unknown";
  let device: "desktop" | "mobile" | "tablet" = "desktop";

  // Browser
  if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("OPR/") || ua.includes("Opera")) browser = "Opera";
  else if (ua.includes("Chrome/")) browser = "Chrome";
  else if (ua.includes("Safari/") && !ua.includes("Chrome")) browser = "Safari";

  // OS
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  // Device
  if (
    ua.includes("Mobile") ||
    (ua.includes("Android") && !ua.includes("Tablet"))
  )
    device = "mobile";
  else if (ua.includes("Tablet") || ua.includes("iPad")) device = "tablet";

  return { browser, os, device };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { path, referrer, sessionId, duration } = body;

    if (!path || typeof path !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const headersList = await headers();
    const forwarded = headersList.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : headersList.get("x-real-ip") || "unknown";
    const ua = headersList.get("user-agent") || "";
    const { browser, os, device } = parseUA(ua);

    // Try to get country from Vercel/Cloudflare headers (works in production)
    const country =
      headersList.get("x-vercel-ip-country") ||
      headersList.get("cf-ipcountry") ||
      null;
    const city =
      headersList.get("x-vercel-ip-city") ||
      headersList.get("cf-ipcity") ||
      null;

    await prisma.pageView.create({
      data: {
        path: path.substring(0, 500),
        referrer: referrer ? String(referrer).substring(0, 1000) : null,
        userAgent: ua.substring(0, 2000),
        ip: ip.substring(0, 45),
        country,
        city,
        device,
        browser,
        os,
        sessionId: sessionId || null,
        duration:
          typeof duration === "number" ? Math.min(duration, 86400) : null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Track error:", error);
    // Never fail the client – tracking is non-critical
    return NextResponse.json({ ok: true });
  }
}
