import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

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
  previewUrl: z.string().optional().nullable(),
  repoUrl: z.string().optional().nullable(),
  images: z.array(z.string()).max(10, "Maximum 10 images allowed").default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
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

    const project = await prisma.project.update({
      where: { id },
      data,
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { message: "Failed to update project" },
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

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { message: "Failed to delete project" },
      { status: 500 },
    );
  }
}
