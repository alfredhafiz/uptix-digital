import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ messageId: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { messageId } = await params;

    // First check if message exists and user has permission
    const existingMessage = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!existingMessage) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 },
      );
    }

    // Only recipients (or admins) should mark messages as read.
    const isAdmin = session.user.role === "ADMIN";
    if (!isAdmin && existingMessage.recipientId !== session.user.id) {
      return NextResponse.json(
        { message: "Forbidden - You can only mark messages sent to you" },
        { status: 403 },
      );
    }

    const message = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error marking message as read:", error);
    return NextResponse.json(
      { message: "Failed to update message" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ messageId: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { messageId } = await params;

    // Only allow users to delete their own messages or admins
    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!message) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 },
      );
    }

    if (message.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Forbidden - You can only delete your own messages" },
        { status: 403 },
      );
    }

    await prisma.message.delete({
      where: {
        id: messageId,
      },
    });

    return NextResponse.json({ message: "Message deleted" });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { message: "Failed to delete message" },
      { status: 500 },
    );
  }
}
