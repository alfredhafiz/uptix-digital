import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const range = url.searchParams.get("range") || "7d";

    let since: Date;
    const now = new Date();
    switch (range) {
      case "today":
        since = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "7d":
        since = new Date(now.getTime() - 7 * 86400000);
        break;
      case "30d":
        since = new Date(now.getTime() - 30 * 86400000);
        break;
      case "90d":
        since = new Date(now.getTime() - 90 * 86400000);
        break;
      default:
        since = new Date(now.getTime() - 7 * 86400000);
    }

    const pvWhere = { createdAt: { gte: since } };

    // Run all queries in parallel
    const [
      totalUsers,
      totalOrders,
      pendingOrders,
      revenueAggregate,
      recentOrders,
      totalViews,
      uniqueSessions,
      topPages,
      topCountries,
      topReferrers,
      deviceBreakdown,
      browserBreakdown,
      osBreakdown,
      recentVisitors,
      dailyViews,
    ] = await Promise.all([
      // Business metrics
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.payment.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
      }),

      // Visitor analytics
      prisma.pageView.count({ where: pvWhere }),

      prisma.pageView
        .groupBy({
          by: ["sessionId"],
          where: { ...pvWhere, sessionId: { not: null } },
        })
        .then((r) => r.length),

      prisma.pageView.groupBy({
        by: ["path"],
        where: pvWhere,
        _count: { path: true },
        orderBy: { _count: { path: "desc" } },
        take: 15,
      }),

      prisma.pageView.groupBy({
        by: ["country"],
        where: { ...pvWhere, country: { not: null } },
        _count: { country: true },
        orderBy: { _count: { country: "desc" } },
        take: 10,
      }),

      prisma.pageView.groupBy({
        by: ["referrer"],
        where: { ...pvWhere, referrer: { not: null } },
        _count: { referrer: true },
        orderBy: { _count: { referrer: "desc" } },
        take: 10,
      }),

      prisma.pageView.groupBy({
        by: ["device"],
        where: pvWhere,
        _count: { device: true },
      }),

      prisma.pageView.groupBy({
        by: ["browser"],
        where: pvWhere,
        _count: { browser: true },
        orderBy: { _count: { browser: "desc" } },
        take: 8,
      }),

      prisma.pageView.groupBy({
        by: ["os"],
        where: pvWhere,
        _count: { os: true },
        orderBy: { _count: { os: "desc" } },
        take: 8,
      }),

      prisma.pageView.findMany({
        where: pvWhere,
        orderBy: { createdAt: "desc" },
        take: 25,
        select: {
          id: true,
          path: true,
          ip: true,
          country: true,
          city: true,
          device: true,
          browser: true,
          os: true,
          referrer: true,
          createdAt: true,
          sessionId: true,
        },
      }),

      prisma
        .$queryRawUnsafe<{ date: string; views: number }[]>(
          `SELECT DATE("createdAt")::text as date, COUNT(*)::int as views
         FROM "PageView"
         WHERE "createdAt" >= $1
         GROUP BY DATE("createdAt")
         ORDER BY date ASC`,
          since,
        )
        .catch(() => [] as { date: string; views: number }[]),
    ]);

    const totalRevenue = revenueAggregate._sum.amount || 0;

    return NextResponse.json({
      // Business
      totalUsers,
      totalOrders,
      totalRevenue,
      pendingOrders,
      recentOrders,
      // Visitor analytics
      totalViews,
      uniqueVisitors: uniqueSessions,
      topPages: topPages.map((p) => ({ path: p.path, views: p._count.path })),
      topCountries: topCountries.map((c) => ({
        country: c.country,
        views: c._count.country,
      })),
      topReferrers: topReferrers.map((r) => ({
        referrer: r.referrer,
        views: r._count.referrer,
      })),
      deviceBreakdown: deviceBreakdown.map((d) => ({
        device: d.device,
        count: d._count.device,
      })),
      browserBreakdown: browserBreakdown.map((b) => ({
        browser: b.browser,
        count: b._count.browser,
      })),
      osBreakdown: osBreakdown.map((o) => ({
        os: o.os,
        count: o._count.os,
      })),
      recentVisitors,
      dailyViews,
    }, {
      headers: {
        "Cache-Control": "private, max-age=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { message: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
