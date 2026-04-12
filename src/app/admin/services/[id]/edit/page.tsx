import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/admin-shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { ServiceForm } from "@/components/admin/service-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Service | Uptix Digital",
  description: "Edit service details.",
};

interface EditServicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditServicePage({
  params,
}: EditServicePageProps) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  const { id } = await params;
  const service = await prisma.service.findUnique({
    where: { id },
  });

  if (!service) {
    notFound();
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Edit Service" text="Update service details." />
      <ServiceForm service={service} />
    </DashboardShell>
  );
}
