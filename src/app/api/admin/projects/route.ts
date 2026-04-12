import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for projects
const projectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(5000, "Description must be less than 5000 characters"),
  price: z
    .number()
    .positive("Price must be positive")
    .max(1000000, "Price must be less than 1,000,000"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(100, "Category must be less than 100 characters"),
  techStack: z
    .array(z.string())
    .max(20, "Maximum 20 technologies allowed")
    .default([]),
  previewUrl: z.string().url("Invalid preview URL").optional().nullable(),
  repoUrl: z.string().url("Invalid repository URL").optional().nullable(),
  images: z
    .array(z.string().url("Invalid image URL"))
    .max(10, "Maximum 10 images allowed")
    .default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate input
    const validationResult = projectSchema.safeParse(body);
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

    const project = await prisma.project.create({
      data,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { message: "Failed to create project" },
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

    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { message: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}
