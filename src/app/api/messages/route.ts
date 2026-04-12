import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for message creation
const messageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(10000, "Message is too long"),
  orderId: z.string().cuid("Invalid order ID").optional().nullable(),
  isGeneral: z.boolean().optional(),
  attachments: z
    .array(
      z
        .string()
        .trim()
        .min(1)
        .refine(
          (value) => value.startsWith("/") || /^https?:\/\//i.test(value),
          "Invalid attachment path",
        ),
    )
    .max(10, "Maximum 10 attachments allowed")
    .optional(),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const isGeneral = searchParams.get("isGeneral");

    let messages;
    const isAdmin = session.user.role === "ADMIN";

    if (orderId) {
      if (!isAdmin) {
        const ownedOrder = await prisma.order.findFirst({
          where: {
            id: orderId,
            userId: session.user.id,
          },
          select: { id: true },
        });

        if (!ownedOrder) {
          return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
      }

      messages = await prisma.message.findMany({
        where: { orderId },
        include: {
          user: {
            select: { id: true, name: true, image: true, role: true },
          },
        },
        orderBy: { createdAt: "asc" },
      });
    } else if (isGeneral === "true") {
      if (isAdmin) {
        messages = await prisma.message.findMany({
          where: {
            orderId: null,
          },
          include: {
            user: {
              select: { id: true, name: true, image: true, role: true },
            },
          },
          orderBy: { createdAt: "asc" },
          take: 200,
        });
      } else {
        messages = await prisma.message.findMany({
          where: {
            orderId: null,
            OR: [{ userId: session.user.id }, { recipientId: session.user.id }],
          },
          include: {
            user: {
              select: { id: true, name: true, image: true, role: true },
            },
          },
          orderBy: { createdAt: "asc" },
          take: 200,
        });
      }
    } else {
      if (isAdmin) {
        messages = await prisma.message.findMany({
          include: {
            user: {
              select: { id: true, name: true, image: true, role: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 100,
        });
      } else {
        const userOrders = await prisma.order.findMany({
          where: { userId: session.user.id },
          select: { id: true },
        });

        const orderIds = userOrders.map(
          (order: (typeof userOrders)[0]) => order.id,
        );

        messages = await prisma.message.findMany({
          where: {
            OR: [
              { orderId: { in: orderIds } },
              {
                orderId: null,
                OR: [
                  { userId: session.user.id },
                  { recipientId: session.user.id },
                ],
              },
            ],
          },
          include: {
            user: {
              select: { id: true, name: true, image: true, role: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 100,
        });
      }
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { message: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate request body
    const validationResult = messageSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: validationResult.error.errors },
        { status: 400 },
      );
    }

    const { content, orderId, isGeneral, attachments } = validationResult.data;

    const isAdmin = session.user.role === "ADMIN";

    if (orderId && isGeneral) {
      return NextResponse.json(
        { message: "orderId and isGeneral cannot be used together" },
        { status: 400 },
      );
    }

    if (orderId && !isAdmin) {
      const ownedOrder = await prisma.order.findFirst({
        where: {
          id: orderId,
          userId: session.user.id,
        },
        select: { id: true },
      });

      if (!ownedOrder) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    }

    let recipientId: string | null = null;
    let normalizedIsGeneral = Boolean(isGeneral);

    // Client support chat: bind messages to an admin recipient to keep threads private.
    if (!orderId && isGeneral && !isAdmin) {
      const primaryAdmin = await prisma.user.findFirst({
        where: { role: "ADMIN" },
        select: { id: true },
        orderBy: { createdAt: "asc" },
      });

      if (!primaryAdmin) {
        return NextResponse.json(
          { message: "No admin available for support chat" },
          { status: 503 },
        );
      }

      recipientId = primaryAdmin.id;
      normalizedIsGeneral = false;
    }

    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        userId: session.user.id,
        orderId: orderId || null,
        recipientId,
        isGeneral: normalizedIsGeneral,
        attachments: attachments || [],
      },
      include: {
        user: {
          select: { id: true, name: true, image: true, role: true },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { message: "Failed to create message" },
      { status: 500 },
    );
  }
}
