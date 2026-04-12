import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/admin-shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { AdminMessagesPanel } from "@/components/admin/admin-messages-panel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Messages | Uptix Digital",
  description: "Manage client messages and support tickets.",
};

export default async function AdminMessagesPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  // Get all unique clients with their latest messages
  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Messages"
        text="Manage client messages and support inquiries."
      />
      <AdminMessagesPanel initialClients={clients} />
    </DashboardShell>
  );
}
