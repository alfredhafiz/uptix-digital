import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/admin-shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { ProjectForm } from "@/components/admin/project-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Project | Uptix Digital",
  description: "Edit portfolio project.",
};

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Edit Project"
        text={`Update "${project.title}" details.`}
      />

      <ProjectForm project={project} />
    </DashboardShell>
  );
}
