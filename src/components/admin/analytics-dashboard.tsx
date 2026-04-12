"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Activity,
  Calendar,
  Eye,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AnalyticsData {
  // Business
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  recentOrders: any[];
  // Visitors
  totalViews: number;
  uniqueVisitors: number;
  topPages: { path: string; views: number }[];
  topCountries: { country: string | null; views: number }[];
  topReferrers: { referrer: string | null; views: number }[];
  deviceBreakdown: { device: string; count: number }[];
  browserBreakdown: { browser: string; count: number }[];
  osBreakdown: { os: string; count: number }[];
  recentVisitors: {
    id: string;
    path: string;
    ip: string;
    country: string | null;
    city: string | null;
    device: string;
    browser: string;
    os: string;
    referrer: string | null;
    createdAt: string;
    sessionId: string | null;
  }[];
  dailyViews: { date: string; views: number }[];
}

type TimeRange = "today" | "7d" | "30d" | "90d";

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [range, setRange] = useState<TimeRange>("7d");
  const [activeTab, setActiveTab] = useState<"overview" | "visitors" | "pages">(
    "overview",
  );

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?range=${range}`);
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Failed to load analytics data</p>
      </div>
    );
  }

  const businessStats = [
    {
      title: "Total Users",
      value: data.totalUsers,
      icon: Users,
      color: "blue",
    },
    {
      title: "Total Orders",
      value: data.totalOrders,
      icon: ShoppingCart,
      color: "purple",
    },
    {
      title: "Revenue",
      value: `$${data.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Pending",
      value: data.pendingOrders,
      icon: Activity,
      color: "yellow",
    },
  ];

  const visitorStats = [
    { title: "Page Views", value: data.totalViews, icon: Eye, color: "cyan" },
    {
      title: "Unique Visitors",
      value: data.uniqueVisitors,
      icon: Users,
      color: "pink",
    },
    {
      title: "Top Country",
      value: data.topCountries[0]?.country || "N/A",
      icon: Globe,
      color: "emerald",
    },
    {
      title: "Avg Views/Day",
      value:
        data.dailyViews.length > 0
          ? Math.round(data.totalViews / Math.max(data.dailyViews.length, 1))
          : 0,
      icon: TrendingUp,
      color: "orange",
    },
  ];

  const colorClasses: Record<string, { bg: string; text: string }> = {
    blue: { bg: "bg-blue-500/10", text: "text-blue-400" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-400" },
    green: { bg: "bg-green-500/10", text: "text-green-400" },
    yellow: { bg: "bg-yellow-500/10", text: "text-yellow-400" },
    cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400" },
    pink: { bg: "bg-pink-500/10", text: "text-pink-400" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
    orange: { bg: "bg-orange-500/10", text: "text-orange-400" },
  };

  const deviceIcon = (d: string) => {
    if (d === "mobile") return Smartphone;
    if (d === "tablet") return Tablet;
    return Monitor;
  };

  const maxPageViews = Math.max(
    ...(data.topPages.map((p) => p.views) || [1]),
    1,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex gap-2">
          {(["overview", "visitors", "pages"] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className={
                activeTab === tab
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "border-white/10 text-slate-400 hover:text-white"
              }
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          {(["today", "7d", "30d", "90d"] as const).map((r) => (
            <Button
              key={r}
              variant={range === r ? "default" : "ghost"}
              size="sm"
              onClick={() => setRange(r)}
              className={
                range === r ? "bg-white/10" : "text-slate-400 hover:text-white"
              }
            >
              {r === "today" ? "Today" : r}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="text-slate-400"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Business Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {businessStats.map((stat) => {
          const colors = colorClasses[stat.color];
          return (
            <Card key={stat.title} className="glass-card border-white/10">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}
                  >
                    <stat.icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Visitor Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {visitorStats.map((stat) => {
          const colors = colorClasses[stat.color];
          return (
            <Card key={stat.title} className="glass-card border-white/10">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}
                  >
                    <stat.icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Views Chart (simple bar) */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                Daily Page Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.dailyViews.length === 0 ? (
                <p className="text-slate-400 text-center py-8 text-sm">
                  No data yet
                </p>
              ) : (
                <div className="flex items-end gap-1 h-40">
                  {data.dailyViews.map((day, i) => {
                    const maxViews = Math.max(
                      ...data.dailyViews.map((d) => d.views),
                      1,
                    );
                    const height = (day.views / maxViews) * 100;
                    return (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center gap-1 group relative"
                      >
                        <div
                          className="w-full bg-blue-500/30 hover:bg-blue-500/50 transition-colors rounded-t min-h-[4px]"
                          style={{ height: `${Math.max(height, 3)}%` }}
                        />
                        <span className="text-[9px] text-slate-500 truncate max-w-full">
                          {new Date(day.date).toLocaleDateString("en", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {day.views} views
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-sm">
                <Activity className="w-4 h-4 mr-2" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.recentOrders.length === 0 ? (
                <p className="text-slate-400 text-center py-4 text-sm">
                  No recent orders
                </p>
              ) : (
                <div className="space-y-3">
                  {data.recentOrders.slice(0, 5).map((order: any) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                    >
                      <div>
                        <p className="text-white text-sm font-medium">
                          {order.title}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {order.user?.email}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          order.status === "DONE"
                            ? "bg-green-500/10 text-green-400"
                            : order.status === "PENDING"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "visitors" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Countries */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-sm">
                  <Globe className="w-4 h-4 mr-2" />
                  Top Countries
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.topCountries.length === 0 ? (
                  <p className="text-slate-400 text-center py-4 text-sm">
                    No data yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {data.topCountries.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <span className="text-white text-sm">
                          {c.country || "Unknown"}
                        </span>
                        <span className="text-slate-400 text-sm">
                          {c.views}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Devices */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-sm">
                  <Monitor className="w-4 h-4 mr-2" />
                  Devices
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.deviceBreakdown.length === 0 ? (
                  <p className="text-slate-400 text-center py-4 text-sm">
                    No data yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {data.deviceBreakdown.map((d, i) => {
                      const Icon = deviceIcon(d.device);
                      const total = data.deviceBreakdown.reduce(
                        (s, x) => s + x.count,
                        0,
                      );
                      const pct =
                        total > 0 ? Math.round((d.count / total) * 100) : 0;
                      return (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-slate-400" />
                              <span className="text-white text-sm capitalize">
                                {d.device}
                              </span>
                            </div>
                            <span className="text-slate-400 text-sm">
                              {pct}%
                            </span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-1.5">
                            <div
                              className="bg-blue-500 h-1.5 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Browsers */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-sm">
                  <Globe className="w-4 h-4 mr-2" />
                  Browsers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.browserBreakdown.length === 0 ? (
                  <p className="text-slate-400 text-center py-4 text-sm">
                    No data yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {data.browserBreakdown.map((b, i) => {
                      const total = data.browserBreakdown.reduce(
                        (s, x) => s + x.count,
                        0,
                      );
                      const pct =
                        total > 0 ? Math.round((b.count / total) * 100) : 0;
                      return (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <span className="text-white text-sm">
                            {b.browser}
                          </span>
                          <span className="text-slate-400 text-sm">
                            {pct}% ({b.count})
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Visitors Table */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-sm">
                <Users className="w-4 h-4 mr-2" />
                Recent Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 px-2 text-slate-400 font-medium">
                        Page
                      </th>
                      <th className="text-left py-2 px-2 text-slate-400 font-medium">
                        IP
                      </th>
                      <th className="text-left py-2 px-2 text-slate-400 font-medium">
                        Country
                      </th>
                      <th className="text-left py-2 px-2 text-slate-400 font-medium">
                        Device
                      </th>
                      <th className="text-left py-2 px-2 text-slate-400 font-medium">
                        Browser
                      </th>
                      <th className="text-left py-2 px-2 text-slate-400 font-medium">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentVisitors.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-8 text-slate-400"
                        >
                          No visitors yet
                        </td>
                      </tr>
                    ) : (
                      data.recentVisitors.map((v) => (
                        <tr
                          key={v.id}
                          className="border-b border-white/5 hover:bg-white/5"
                        >
                          <td className="py-2 px-2 text-white max-w-[200px] truncate">
                            {v.path}
                          </td>
                          <td className="py-2 px-2 text-slate-300 font-mono text-xs">
                            {v.ip}
                          </td>
                          <td className="py-2 px-2 text-slate-300">
                            {v.country || "—"} {v.city ? `(${v.city})` : ""}
                          </td>
                          <td className="py-2 px-2 text-slate-300 capitalize">
                            {v.device}
                          </td>
                          <td className="py-2 px-2 text-slate-300">
                            {v.browser} / {v.os}
                          </td>
                          <td className="py-2 px-2 text-slate-400 text-xs whitespace-nowrap">
                            {new Date(v.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "pages" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-sm">
                <Eye className="w-4 h-4 mr-2" />
                Top Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.topPages.length === 0 ? (
                <p className="text-slate-400 text-center py-4 text-sm">
                  No data yet
                </p>
              ) : (
                <div className="space-y-3">
                  {data.topPages.map((p, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-sm truncate max-w-[300px]">
                          {p.path}
                        </span>
                        <span className="text-slate-400 text-sm ml-2">
                          {p.views}
                        </span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1.5">
                        <div
                          className="bg-cyan-500 h-1.5 rounded-full transition-all"
                          style={{
                            width: `${(p.views / maxPageViews) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Referrers */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-sm">
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Top Referrers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.topReferrers.length === 0 ? (
                <p className="text-slate-400 text-center py-4 text-sm">
                  No referrer data yet
                </p>
              ) : (
                <div className="space-y-2">
                  {data.topReferrers.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-1"
                    >
                      <span className="text-white text-sm truncate max-w-[300px]">
                        {r.referrer || "Direct"}
                      </span>
                      <span className="text-slate-400 text-sm ml-2">
                        {r.views}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* OS Breakdown */}
          <Card className="glass-card border-white/10 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-sm">
                <Monitor className="w-4 h-4 mr-2" />
                Operating Systems
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.osBreakdown.length === 0 ? (
                <p className="text-slate-400 text-center py-4 text-sm">
                  No data yet
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {data.osBreakdown.map((o, i) => {
                    const total = data.osBreakdown.reduce(
                      (s, x) => s + x.count,
                      0,
                    );
                    const pct =
                      total > 0 ? Math.round((o.count / total) * 100) : 0;
                    return (
                      <div
                        key={i}
                        className="text-center p-4 rounded-lg bg-white/5"
                      >
                        <p className="text-2xl font-bold text-white">{pct}%</p>
                        <p className="text-slate-400 text-sm mt-1">{o.os}</p>
                        <p className="text-slate-500 text-xs">
                          {o.count} views
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  );
}
