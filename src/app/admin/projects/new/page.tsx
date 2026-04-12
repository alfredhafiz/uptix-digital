import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/admin-shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { ProjectForm } from "@/components/admin/project-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Project | Uptix Digital",
  description: "Create a new portfolio project.",
};

export default async function NewProjectPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="New Project"
        text="Create a new portfolio project."
      />
      <ProjectForm />
    </DashboardShell>
  );
}
