import { prisma } from "./prisma";

export type OrderAuditAction =
  | "STATUS_CHANGED"
  | "DUE_DATE_UPDATED"
  | "NOTES_ADDED"
  | "ORDER_CREATED"
  | "REVISION_REQUESTED"
  | "PAYMENT_MADE";

export interface AuditLogDetails {
  action: OrderAuditAction;
  before?: string | number | boolean | null;
  after?: string | number | boolean | null;
  message?: string;
}

export async function logOrderAction(
  orderId: string,
  auditLog: AuditLogDetails,
) {
  try {
    await prisma.orderAuditLog.create({
      data: {
        orderId,
        action: auditLog.action,
        details: JSON.stringify({
          ...auditLog,
          timestamp: new Date().toISOString(),
        }),
      },
    });
  } catch (error) {
    console.error("Failed to log order action:", error);
    // Don't throw - logging failures shouldn't break the main operation
  }
}

export async function getOrderAuditLogs(orderId: string) {
  try {
    return await prisma.orderAuditLog.findMany({
      where: { orderId },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch audit logs:", error);
    return [];
  }
}
