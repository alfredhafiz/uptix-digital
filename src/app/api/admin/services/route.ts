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

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { message: "Failed to fetch services" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const validationResult = serviceSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    // Check if slug already exists
    const existing = await prisma.service.findUnique({
      where: { slug: body.slug },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Service with this slug already exists" },
        { status: 400 },
      );
    }

    const service = await prisma.service.create({
      data: validationResult.data,
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { message: "Failed to create service" },
      { status: 500 },
    );
  }
}
