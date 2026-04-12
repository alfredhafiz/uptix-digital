import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/admin-shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Analytics | Uptix Digital",
  description: "Track platform activity and business metrics.",
};

export default async function AdminAnalyticsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Analytics"
        text="Monitor users, orders, revenue, and recent activity."
      />
      <AnalyticsDashboard />
    </DashboardShell>
  );
}
