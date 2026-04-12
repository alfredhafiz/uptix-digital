import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/shell";
import { OrderDetailClient } from "@/components/dashboard/order-detail-client";
import { getOrderAuditLogs } from "@/lib/order-audit";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order Details | Uptix Digital",
  description: "Track your project progress in real time.",
};

export default async function ClientOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) redirect("/auth/login");
  if (!id) redirect("/client/orders");

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      payments: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!order) redirect("/client/orders");
  if (order.userId !== session.user.id) redirect("/client/orders");

  // Fetch audit logs separately (will populate once Prisma client regenerates)
  let auditLogs: any[] = [];
  try {
    auditLogs = await getOrderAuditLogs(id);
  } catch (error) {
    console.warn("Audit logs not yet available");
  }

  // Serialize dates to plain objects for client component
  const serializedOrder = JSON.parse(JSON.stringify(order));
  const serializedAuditLogs = JSON.parse(JSON.stringify(auditLogs));

  return (
    <DashboardShell>
      <OrderDetailClient
        orderId={id}
        userId={session.user.id}
        initialOrder={serializedOrder}
        auditLogs={serializedAuditLogs}
      />
    </DashboardShell>
  );
}
