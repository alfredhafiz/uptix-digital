import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/admin-shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Users | Uptix Digital",
  description: "View and manage all users.",
};

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          orders: true,
        },
      },
    },
  });

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Manage Users"
        text="View and manage all registered users."
      />

      <div className="grid gap-4">
        {users.length === 0 ? (
          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <p className="text-slate-400 text-center">No users found.</p>
            </CardContent>
          </Card>
        ) : (
          users.map((user: (typeof users)[0]) => (
            <Card key={user.id} className="glass-card border-white/10">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">
                      {user.name || "Unnamed User"}
                    </CardTitle>
                    <p className="text-slate-400 text-sm">{user.email}</p>
                  </div>
                  <Badge
                    className={
                      user.role === "ADMIN"
                        ? "bg-purple-500/10 text-purple-400"
                        : "bg-blue-500/10 text-blue-400"
                    }
                  >
                    {user.role}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm text-slate-400">
                  <span>Orders: {user._count.orders}</span>
                  <span>
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardShell>
  );
}
