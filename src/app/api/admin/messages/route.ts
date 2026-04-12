import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 },
      );
    }

    const adminId = session.user.id;

    // Get all messages between admin and this specific client (both directions)
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          // Client → Admin
          { userId: userId, recipientId: adminId },
          // Admin → Client
          { userId: adminId, recipientId: userId },
          // Client messages with no specific recipient (legacy general messages)
          { userId: userId, recipientId: null, isGeneral: false },
        ],
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching admin messages:", error);
    return NextResponse.json(
      { message: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { content, recipientId } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { message: "Content is required" },
        { status: 400 },
      );
    }

    if (!recipientId) {
      return NextResponse.json(
        { message: "recipientId is required" },
        { status: 400 },
      );
    }

    // Verify recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
      select: { id: true },
    });

    if (!recipient) {
      return NextResponse.json(
        { message: "Recipient not found" },
        { status: 404 },
      );
    }

    // Create clean message with proper recipientId (no prefix hack)
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        userId: session.user.id,
        recipientId: recipientId,
        isGeneral: false,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error creating admin message:", error);
    return NextResponse.json(
      { message: "Failed to create message" },
      { status: 500 },
    );
  }
}
