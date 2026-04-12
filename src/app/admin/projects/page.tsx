import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/admin-shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Projects | Uptix Digital",
  description: "Manage portfolio projects.",
};

export default async function AdminProjectsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Manage Projects"
        text="Create and manage portfolio projects."
      />

      <div className="mb-6">
        <Link href="/admin/projects/new">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {projects.length === 0 ? (
          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <p className="text-slate-400 text-center">No projects found.</p>
            </CardContent>
          </Card>
        ) : (
          projects.map((project: (typeof projects)[0]) => (
            <Card key={project.id} className="glass-card border-white/10">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">
                      {project.title}
                    </CardTitle>
                    <p className="text-slate-400 text-sm mt-1">
                      {project.category}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/projects/${project.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm line-clamp-2">
                  {project.description}
                </p>
                <div className="flex gap-2 mt-4">
                  {project.techStack.slice(0, 3).map((tech: string) => (
                    <span
                      key={tech}
                      className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardShell>
  );
}
