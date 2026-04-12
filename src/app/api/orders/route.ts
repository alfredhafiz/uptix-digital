import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  sendEmail,
  generateOrderConfirmationEmail,
  generateNewOrderNotificationEmail,
} from "@/lib/email";
import { NextResponse } from "next/server";
import { z } from "zod";

const serviceTypeSchema = z.enum(
  [
    "WEB_DEVELOPMENT",
    "APP_DEVELOPMENT",
    "PERFORMANCE_OPTIMIZATION",
    "API_DEVELOPMENT",
    "PYTHON_APPLICATION",
    "MOBILE_APP",
    "CONSULTATION",
    "FULL_STACK",
  ],
  { errorMap: () => ({ message: "Invalid service type" }) },
);

const filePathSchema = z
  .string()
  .trim()
  .min(1)
  .refine(
    (value) => value.startsWith("/") || /^https?:\/\//i.test(value),
    "Invalid file URL or path",
  );

// Validation schema for order creation
const orderCreationSchema = z.object({
  serviceType: serviceTypeSchema,
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(255, "Title must be less than 255 characters"),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description must be less than 5000 characters"),
  budget: z
    .preprocess((value) => {
      if (value === "" || value === null || value === undefined) return null;
      if (typeof value === "number") return value;
      if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : value;
      }
      return value;
    }, z.number().positive("Budget must be positive").max(999999, "Budget exceeds maximum").nullable())
    .optional(),
  timeline: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z
      .string()
      .trim()
      .max(100, "Timeline must be less than 100 characters")
      .optional(),
  ),
  files: z.array(filePathSchema).max(10, "Maximum 10 files allowed").optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate request body with Zod
    const validationResult = orderCreationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: validationResult.error.errors },
        { status: 400 },
      );
    }

    const { serviceType, title, description, budget, timeline, files } =
      validationResult.data;

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        serviceType,
        title,
        description,
        budget: budget || null,
        timeline: timeline || null,
        status: "PENDING",
        files: files || [],
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Email delivery should not block successful order creation.
    const emailJobs: Promise<unknown>[] = [];

    if (order.user.email) {
      emailJobs.push(
        sendEmail({
          to: order.user.email,
          subject: `Order Confirmation - ${order.title}`,
          html: generateOrderConfirmationEmail({
            orderId: order.id,
            title: order.title,
            amount: order.budget || 0,
            clientName: order.user.name || "Valued Client",
          }),
        }),
      );
    }

    emailJobs.push(
      sendEmail({
        to: "admin@uptixdigital.com",
        subject: `New Order: ${order.title}`,
        html: generateNewOrderNotificationEmail({
          orderId: order.id,
          title: order.title,
          clientName: order.user.name || "Anonymous",
          clientEmail: order.user.email || "",
          amount: order.budget || undefined,
        }),
      }),
    );

    const emailResults = await Promise.allSettled(emailJobs);
    const failedEmails = emailResults.filter(
      (result) => result.status === "rejected",
    );
    if (failedEmails.length > 0) {
      console.warn(
        `Order ${order.id} created but ${failedEmails.length} email(s) failed`,
      );
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 },
    );
  }
}
