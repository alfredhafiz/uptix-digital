import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { OrdersList } from "@/components/dashboard/orders-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Orders | Uptix Digital",
  description: "View and manage all your orders.",
};

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const orders = await prisma.order.findMany({
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

  return (
    <DashboardShell>
      <DashboardHeader
        heading="My Orders"
        text="View and manage all your orders."
      />
      <OrdersList orders={orders} />
    </DashboardShell>
  );
}
