import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Public endpoint that returns only the custom scripts (no auth needed)
// This is safe because these scripts are already meant to be injected into the public page
export async function GET() {
  try {
    const settings = await prisma.settings.findMany({
      where: {
        key: {
          in: [
            "customHeadScripts",
            "customBodyScripts",
            "googleAnalyticsId",
            "enableAnalytics",
          ],
        },
      },
    });

    const result: Record<string, string | boolean> = {};
    for (const s of settings) {
      if (s.key === "enableAnalytics") {
        result[s.key] = s.value === "true";
        continue;
      }
      result[s.key] = s.value;
    }

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch {
    return NextResponse.json({});
  }
}
