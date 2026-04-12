import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/admin-shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { BulkOrdersManager } from "@/components/admin/bulk-orders-manager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Orders | Uptix Digital",
  description: "View and manage all customer orders.",
};

export default async function AdminOrdersPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  const orders = await prisma.order.findMany({
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

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-400",
    IN_PROGRESS: "bg-blue-500/10 text-blue-400",
    REVISION: "bg-orange-500/10 text-orange-400",
    REVIEW: "bg-purple-500/10 text-purple-400",
    DONE: "bg-green-500/10 text-green-400",
    CANCELLED: "bg-red-500/10 text-red-400",
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Manage Orders"
        text="View and manage all customer orders."
      />

      <BulkOrdersManager orders={orders} statusColors={statusColors} />
    </DashboardShell>
  );
}
