import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/admin-shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { AdminSettingsForm } from "@/components/admin/admin-settings-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Settings | Uptix Digital",
  description:
    "Manage system settings, payment gateways, email configuration, and more.",
};

export default async function AdminSettingsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Admin Settings"
        text="Configure system settings, payment gateways, email, and analytics."
      />
      <AdminSettingsForm />
    </DashboardShell>
  );
}
