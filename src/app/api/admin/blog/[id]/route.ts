import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const blogPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200, "Slug must be less than 200 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),
  excerpt: z
    .string()
    .max(500, "Excerpt must be less than 500 characters")
    .optional()
    .nullable(),
  content: z
    .string()
    .min(1, "Content is required")
    .max(50000, "Content must be less than 50000 characters"),
  coverImage: z.string().optional().nullable(),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed").default([]),
  metaTitle: z
    .string()
    .max(200, "Meta title must be less than 200 characters")
    .optional()
    .nullable(),
  metaDesc: z
    .string()
    .max(500, "Meta description must be less than 500 characters")
    .optional()
    .nullable(),
  published: z.boolean().default(false),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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

    // Check if slug already exists (excluding current blog)
    const existingBlog = await prisma.blog.findFirst({
      where: {
        slug: data.slug,
        id: { not: id },
      },
    });

    if (existingBlog) {
      return NextResponse.json(
        { message: "A blog post with this slug already exists" },
        { status: 409 },
      );
    }

    const blog = await prisma.blog.update({
      where: { id },
      data,
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { message: "Failed to update blog post" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.blog.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { message: "Failed to delete blog post" },
      { status: 500 },
    );
  }
}
