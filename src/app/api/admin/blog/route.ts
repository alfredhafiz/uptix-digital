import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeHTMLServer } from "@/lib/xss-protection";
import { CONTENT_LIMITS } from "@/lib/constants";
import { NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for blog posts
const blogPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(
      CONTENT_LIMITS.BLOG_TITLE_MAX,
      `Title must be less than ${CONTENT_LIMITS.BLOG_TITLE_MAX} characters`,
    ),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(
      CONTENT_LIMITS.BLOG_TITLE_MAX,
      `Slug must be less than ${CONTENT_LIMITS.BLOG_TITLE_MAX} characters`,
    )
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),
  excerpt: z
    .string()
    .max(
      CONTENT_LIMITS.BLOG_EXCERPT_MAX,
      `Excerpt must be less than ${CONTENT_LIMITS.BLOG_EXCERPT_MAX} characters`,
    )
    .optional()
    .nullable(),
  content: z
    .string()
    .min(1, "Content is required")
    .max(
      CONTENT_LIMITS.BLOG_CONTENT_MAX,
      `Content must be less than ${CONTENT_LIMITS.BLOG_CONTENT_MAX} characters`,
    ),
  coverImage: z.string().optional().nullable(),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed").default([]),
  metaTitle: z
    .string()
    .max(
      CONTENT_LIMITS.BLOG_TITLE_MAX,
      "Meta title must be less than 200 characters",
    )
    .optional()
    .nullable(),
  metaDesc: z
    .string()
    .max(
      CONTENT_LIMITS.BLOG_EXCERPT_MAX,
      "Meta description must be less than 500 characters",
    )
    .optional()
    .nullable(),
  published: z.boolean().default(false),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate input
    const validationResult = blogPostSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validationResult.error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 },
      );
    }

    const data = validationResult.data;

    // Sanitize content to prevent XSS
    const sanitizedContent = sanitizeHTMLServer(data.content);

    // Check if slug already exists
    const existingBlog = await prisma.blog.findUnique({
      where: { slug: data.slug },
    });

    if (existingBlog) {
      return NextResponse.json(
        { message: "A blog post with this slug already exists" },
        { status: 409 },
      );
    }

    const blog = await prisma.blog.create({
      data: {
        ...data,
        content: sanitizedContent,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { message: "Failed to create blog post" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { message: "Failed to fetch blog posts" },
      { status: 500 },
    );
  }
}
