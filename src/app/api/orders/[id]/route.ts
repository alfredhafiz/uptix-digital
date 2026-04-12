import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logOrderAction, type AuditLogDetails } from "@/lib/order-audit";
import {
  notifyStatusChange,
  notifyRevisionRequest,
} from "@/lib/order-notifications";
import { NextResponse } from "next/server";
import { z } from "zod";

const orderStatusSchema = z.enum([
  "PENDING",
  "IN_PROGRESS",
  "REVISION",
  "REVIEW",
  "DONE",
  "CANCELLED",
]);

const clientPatchSchema = z.object({
  action: z.literal("request_revision"),
});

const adminPatchSchema = z
  .object({
    status: orderStatusSchema.optional(),
    dueDate: z
      .union([z.string().date(), z.string().datetime(), z.null()])
      .optional(),
    internalNotes: z
      .union([z.string().max(5000, "Internal notes are too long"), z.null()])
      .optional(),
    message: z.string().max(500, "Message is too long").optional(),
  })
  .refine(
    (value) =>
      value.status !== undefined ||
      value.dueDate !== undefined ||
      value.internalNotes !== undefined,
    {
      message: "No valid fields provided for update",
    },
  );

// GET /api/orders/[id] – fetch single order with messages, payments, user
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const isAdmin = session.user.role === "ADMIN";

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
        payments: {
          orderBy: { createdAt: "desc" },
        },
        messages: {
          include: {
            user: {
              select: { id: true, name: true, image: true, role: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        auditLogs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Non-admin can only view their own order
    if (!isAdmin && order.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { message: "Failed to fetch order" },
      { status: 500 },
    );
  }
}

// PATCH /api/orders/[id] – update order (admin: full; client: request revision only)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const isAdmin = session.user.role === "ADMIN";
    const body = await req.json();

    const order = await prisma.order.findUnique({
      where: { id },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Non-admin can only request a revision on their own order
    if (!isAdmin) {
      if (order.userId !== session.user.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
      const validationResult = clientPatchSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json(
          { message: "Forbidden action" },
          { status: 403 },
        );
      }

      const updated = await prisma.order.update({
        where: { id },
        data: {
          status: "REVISION",
          revisionCount: { increment: 1 },
        },
      });

      // Log revision request
      await logOrderAction(id, {
        action: "REVISION_REQUESTED",
        before: order.status,
        after: "REVISION",
        message: `Revision requested (Total revisions: ${order.revisionCount + 1})`,
      });

      // Send notification email to admin
      try {
        await notifyRevisionRequest({
          orderId: id,
          revisionCount: order.revisionCount + 1,
          clientEmail: order.user?.email || "",
          clientName: order.user?.name || "Client",
        });
      } catch (error) {
        console.warn("Failed to send revision notification:", error);
      }

      return NextResponse.json(updated);
    }

    // Admin can update status, dueDate, startedAt, completedAt, internalNotes
    const validationResult = adminPatchSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    const validatedBody = validationResult.data;
    const updateData: Record<string, unknown> = {};
    const auditLogs: AuditLogDetails[] = [];

    if (
      validatedBody.status !== undefined &&
      validatedBody.status !== order.status
    ) {
      updateData.status = validatedBody.status;
      if (validatedBody.status === "IN_PROGRESS" && !order.startedAt) {
        updateData.startedAt = new Date();
      }
      if (validatedBody.status === "DONE" && !order.completedAt) {
        updateData.completedAt = new Date();
      }
      // Queue audit log (will log AFTER DB update succeeds)
      auditLogs.push({
        action: "STATUS_CHANGED",
        before: order.status,
        after: validatedBody.status,
        message: `Status changed from ${order.status} to ${validatedBody.status}`,
      });
    }
    if (validatedBody.dueDate !== undefined) {
      const parsedDueDate = validatedBody.dueDate
        ? new Date(validatedBody.dueDate)
        : null;
      const hasChanged =
        parsedDueDate?.toISOString() !== order.dueDate?.toISOString();

      if (hasChanged || (!parsedDueDate && order.dueDate)) {
        const newDueDate = parsedDueDate;
        updateData.dueDate = newDueDate;
        // Queue audit log
        auditLogs.push({
          action: "DUE_DATE_UPDATED",
          before: order.dueDate?.toISOString() || null,
          after: newDueDate?.toISOString() || null,
          message: `Due date updated to ${newDueDate?.toLocaleDateString() || "unset"}`,
        });
      }
    }
    if (
      validatedBody.internalNotes !== undefined &&
      validatedBody.internalNotes !== order.internalNotes
    ) {
      updateData.internalNotes = validatedBody.internalNotes;
      // Queue audit log
      auditLogs.push({
        action: "NOTES_ADDED",
        message: "Internal notes updated",
      });
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(order);
    }

    // CRITICAL: Do database update FIRST
    const updated = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    // THEN audit log each change (only if update succeeded)
    for (const log of auditLogs) {
      try {
        await logOrderAction(id, log);
      } catch (error) {
        console.warn("Failed to log audit action:", error);
      }
    }

    // Send status change notification if status was changed
    if (
      validatedBody.status !== undefined &&
      validatedBody.status !== order.status
    ) {
      try {
        await notifyStatusChange({
          orderId: id,
          previousStatus: order.status,
          newStatus: validatedBody.status,
          message: validatedBody.message,
        });
      } catch (error) {
        console.warn("Failed to send status notification:", error);
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { message: "Failed to update order" },
      { status: 500 },
    );
  }
}
