import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Calendar, User, ArrowLeft, Clock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DOMPurify from "isomorphic-dompurify";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await prisma.blog.findUnique({
      where: { slug },
    });

    if (!post) {
      return {
        title: "Post Not Found | Uptix Digital",
      };
    }

    return {
      title: `${post.title} | Uptix Digital Blog`,
      description: post.excerpt || post.content.slice(0, 160),
      openGraph: {
        title: post.title,
        description: post.excerpt || post.content.slice(0, 160),
        images: post.coverImage ? [post.coverImage] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Blog | Uptix Digital",
    };
  }
}

function sanitizeContent(content: string): string {
  const contentWithBreaks = content.replace(/\n/g, "<br/>");

  return DOMPurify.sanitize(contentWithBreaks, {
    ALLOWED_TAGS: [
      "b",
      "i",
      "em",
      "strong",
      "a",
      "p",
      "br",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "code",
      "pre",
    ],
    ALLOWED_ATTR: ["href", "title", "target"],
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  let post: Awaited<ReturnType<typeof prisma.blog.findFirst>> = null;
  try {
    post = await prisma.blog.findFirst({
      where: {
        slug,
        published: true,
      },
    });
  } catch (error) {
    console.error("Error loading blog post:", error);
    notFound();
  }

  if (!post) {
    notFound();
  }

  const author = await prisma.user.findUnique({
    where: { id: post.authorId },
    select: { name: true },
  });

  const sanitizedContent = sanitizeContent(post.content);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Link
          href="/blog"
          className="inline-flex items-center text-slate-400 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-sm bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <span className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              {author?.name || "Uptix Team"}
            </span>
            <span className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              {Math.ceil(post.content.length / 1000)} min read
            </span>
          </div>
        </div>

        {post.coverImage && (
          <div className="relative h-[400px] rounded-2xl overflow-hidden mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 80vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        <article className="prose prose-invert prose-lg max-w-none">
          <div
            className="text-slate-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </article>

        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Share this article</span>
            <Button variant="outline" className="glass-card">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
