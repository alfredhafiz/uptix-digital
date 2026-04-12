import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/admin-shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { BlogPostForm } from "@/components/admin/blog-post-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Blog Post | Uptix Digital",
  description: "Create a new blog post.",
};

export default async function NewBlogPostPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="New Blog Post" text="Create a new blog post." />
      <BlogPostForm />
    </DashboardShell>
  );
}
