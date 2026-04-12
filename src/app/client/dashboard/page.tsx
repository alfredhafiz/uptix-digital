import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { OrdersList } from "@/components/dashboard/orders-list";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentMessages } from "@/components/dashboard/recent-messages";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard | Uptix Digital",
  description:
    "Manage your projects, track orders, and communicate with our team.",
};

export default async function DashboardPage() {
  try {
    const session = await auth();

    if (!session?.user) {
      redirect("/auth/login");
    }

    let orders: any[] = [];
    let error = null;

    try {
      orders = await prisma.order.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "desc",
            },
            take: 5,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      error = "Failed to load your orders. Please try again later.";
    }

    const totalOrders = orders.length;
    const activeOrders = orders.filter(
      (o) => o.status === "IN_PROGRESS",
    ).length;
    const completedOrders = orders.filter((o) => o.status === "DONE").length;

    return (
      <DashboardShell>
        <DashboardHeader
          heading="Dashboard"
          text="Manage your projects and track your orders."
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
          <StatsCards
            totalOrders={totalOrders}
            activeOrders={activeOrders}
            completedOrders={completedOrders}
          />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <OrdersList orders={orders} />
            <RecentMessages orders={orders} />
          </div>
        </div>
      </DashboardShell>
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    redirect("/auth/login");
  }
}
