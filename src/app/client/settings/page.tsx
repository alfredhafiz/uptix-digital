import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { UserSettingsForm } from "@/components/dashboard/user-settings-form";
import { PasswordChangeForm } from "@/components/dashboard/password-change-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account Settings | Uptix Digital",
  description: "Manage your account settings, profile, and security.",
};

export default async function UserSettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Fetch current user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Account Settings"
        text="Manage your profile, security, and preferences."
      />

      <div className="grid gap-8">
        {/* Profile Settings */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Profile Information</CardTitle>
            <CardDescription className="text-slate-400">
              Update your profile information and avatar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserSettingsForm user={user} />
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Security</CardTitle>
            <CardDescription className="text-slate-400">
              Change your password to keep your account secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordChangeForm userId={user.id} />
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400">Account Type</label>
                <p className="text-white font-medium">{user.role}</p>
              </div>
              <div>
                <label className="text-sm text-slate-400">Member Since</label>
                <p className="text-white font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
