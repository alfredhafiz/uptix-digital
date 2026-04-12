import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/admin-shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { AdminStats } from "@/components/dashboard/admin-stats";
import { RecentOrders } from "@/components/dashboard/admin-recent-orders";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard | Uptix Digital",
  description: "Manage orders, users, and content.",
};

export default async function AdminDashboardPage() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      redirect("/auth/login");
    }

    // Wrap database calls in try-catch to handle errors gracefully
    let totalOrders = 0;
    let totalUsers = 0;
    let totalProjects = 0;
    let totalBlogs = 0;
    let recentOrders: any[] = [];
    let error = null;

    try {
      [totalOrders, totalUsers, totalProjects, totalBlogs] = await Promise.all([
        prisma.order.count(),
        prisma.user.count(),
        prisma.project.count(),
        prisma.blog.count(),
      ]);

      recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      error = "Failed to load some dashboard data. Please try again later.";
    }

    return (
      <DashboardShell>
        <DashboardHeader
          heading="Admin Dashboard"
          text="Manage your agency operations."
        />

        {error && (
          <Card className="glass-card border-red-500/20 bg-red-500/5 mb-6">
            <CardContent className="p-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
              <p className="text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-8">
          <AdminStats
            totalOrders={totalOrders}
            totalUsers={totalUsers}
            totalProjects={totalProjects}
            totalBlogs={totalBlogs}
          />
          <div className="grid gap-8 md:grid-cols-3">
            <RecentOrders orders={recentOrders} />
            <QuickActions />
          </div>
        </div>
      </DashboardShell>
    );
  } catch (error) {
    console.error("Admin dashboard error:", error);
    redirect("/auth/login");
  }
}
