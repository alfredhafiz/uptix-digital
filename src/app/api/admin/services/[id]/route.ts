import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const serviceSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  features: z.array(z.string()),
  icon: z.string().min(1),
  color: z.string().min(1),
  price: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  order: z.number().default(0),
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
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

    const validationResult = serviceSchema.partial().safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    const service = await prisma.service.update({
      where: { id },
      data: validationResult.data,
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { message: "Failed to update service" },
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
    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { message: "Failed to delete service" },
      { status: 500 },
    );
  }
}
