import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/admin-shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { BlogPostForm } from "@/components/admin/blog-post-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Blog Post | Uptix Digital",
  description: "Edit blog post.",
};

interface EditBlogPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  const { id } = await params;
  const blog = await prisma.blog.findUnique({
    where: { id },
  });

  if (!blog) {
    notFound();
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Edit Blog Post"
        text="Update blog post details."
      />
      <BlogPostForm blog={blog} />
    </DashboardShell>
  );
}
