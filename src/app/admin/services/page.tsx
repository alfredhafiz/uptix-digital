import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/admin-shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Services | Uptix Digital",
  description: "Manage services offerings.",
};

export default async function AdminServicesPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Manage Services"
        text="Create and manage service offerings."
      />

      <div className="mb-6">
        <Link href="/admin/services/new">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {services.length === 0 ? (
          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <p className="text-slate-400 text-center">No services found.</p>
            </CardContent>
          </Card>
        ) : (
          services.map((service: (typeof services)[0]) => (
            <Card key={service.id} className="glass-card border-white/10">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">
                      {service.title}
                    </CardTitle>
                    <p className="text-slate-400 text-sm mt-1">
                      {service.price}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/services/${service.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm line-clamp-2">
                  {service.description}
                </p>
                <div className="flex gap-2 mt-4">
                  {service.features
                    .slice(0, 3)
                    .map((feature: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  {service.features.length > 3 && (
                    <span className="text-xs bg-slate-500/10 text-slate-400 px-2 py-1 rounded">
                      +{service.features.length - 3} more
                    </span>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  {!service.published && (
                    <span className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded">
                      Draft
                    </span>
                  )}
                  {service.featured && (
                    <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardShell>
  );
}
