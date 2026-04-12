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
  title: "Manage Blog | Uptix Digital",
  description: "Create and manage blog posts.",
};

export default async function AdminBlogPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Manage Blog"
        text="Create and manage blog posts."
      />

      <div className="mb-6">
        <Link href="/admin/blog/new">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {blogs.length === 0 ? (
          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <p className="text-slate-400 text-center">No blog posts found.</p>
            </CardContent>
          </Card>
        ) : (
          blogs.map((blog: (typeof blogs)[0]) => (
            <Card key={blog.id} className="glass-card border-white/10">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">{blog.title}</CardTitle>
                    <p className="text-slate-400 text-sm mt-1">
                      By {blog.author.name || blog.author.email} •{" "}
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${blog.published ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}
                    >
                      {blog.published ? "Published" : "Draft"}
                    </span>
                    <Link href={`/admin/blog/${blog.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm line-clamp-2">
                  {blog.excerpt || blog.content.slice(0, 150)}...
                </p>
                <div className="flex gap-2 mt-4">
                  {blog.tags.slice(0, 3).map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded"
                    >
                      {tag}
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
