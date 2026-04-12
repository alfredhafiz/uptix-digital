import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/admin-shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { ServiceForm } from "@/components/admin/service-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Service | Uptix Digital",
  description: "Create a new service.",
};

export default async function NewServicePage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Create New Service"
        text="Add a new service offering to your portfolio."
      />
      <ServiceForm />
    </DashboardShell>
  );
}
