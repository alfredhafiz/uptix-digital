import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Blog | Uptix Digital",
  description:
    "Latest insights, tutorials, and news from Uptix Digital. Learn about web development, app development, and digital transformation.",
};

export default async function BlogPage() {
  const posts = await prisma.blog.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-blue-400 font-mono text-sm">// BLOG</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Latest <span className="gradient-text">Insights</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto font-mono">
            Thoughts, tutorials, and insights on web development, app
            development, and digital innovation.
          </p>
        </div>

        {/* Blog Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">
              No blog posts yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: (typeof posts)[0]) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="glass-card border-white/10 h-full hover:border-white/20 transition-all group overflow-hidden">
                  {post.coverImage && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {Math.ceil(post.content.length / 1000)} min read
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-3 group-hover:gradient-text transition-all line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                      {post.excerpt || post.content.slice(0, 150)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-slate-400">
                        <User className="w-4 h-4 mr-1" />
                        {post.author.name || "Uptix Team"}
                      </div>
                      <span className="text-blue-400 text-sm flex items-center group-hover:translate-x-1 transition-transform">
                        Read More <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.slice(0, 3).map((tag: string) => (
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
