/**
 * Audit Logging Utility
 * Logs all critical actions for compliance and security
 */

import { prisma } from "./prisma";
import { getClientIP } from "./rate-limit";

export interface AuditLogEntry {
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status?: "SUCCESS" | "FAILED" | "ERROR";
  reason?: string;
}

/**
 * Log an action for audit trail
 */
export async function logAuditAction(entry: AuditLogEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId,
        changes: entry.changes as any, // Type assertion for JSON field
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        status: entry.status || "SUCCESS",
        reason: entry.reason,
      },
    });
  } catch (error) {
    console.error("[AUDIT LOG] Failed to create audit log:", error);
    // Don't throw - we don't want logging to break the application
  }
}

/**
 * Log admin action with request context
 */
export async function logAdminAction(
  userId: string,
  action: string,
  entity: string,
  entityId: string | undefined,
  request: Request,
  changes?: Record<string, any>,
  status: "SUCCESS" | "FAILED" | "ERROR" = "SUCCESS",
  reason?: string,
): Promise<void> {
  await logAuditAction({
    userId,
    action,
    entity,
    entityId,
    changes,
    ipAddress: getClientIP(request),
    userAgent: request.headers.get("user-agent") || undefined,
    status,
    reason,
  });
}

/**
 * Common audit actions
 */
export const AUDIT_ACTIONS = {
  // User
  USER_LOGIN: "USER_LOGIN",
  USER_LOGOUT: "USER_LOGOUT",
  USER_REGISTER: "USER_REGISTER",
  USER_PASSWORD_CHANGE: "USER_PASSWORD_CHANGE",
  USER_PASSWORD_RESET: "USER_PASSWORD_RESET",
  USER_PROFILE_UPDATE: "USER_PROFILE_UPDATE",
  USER_DELETE: "USER_DELETE",
  USER_ROLE_CHANGE: "USER_ROLE_CHANGE",

  // Blog
  BLOG_CREATE: "BLOG_CREATE",
  BLOG_UPDATE: "BLOG_UPDATE",
  BLOG_DELETE: "BLOG_DELETE",
  BLOG_PUBLISH: "BLOG_PUBLISH",
  BLOG_UNPUBLISH: "BLOG_UNPUBLISH",

  // Project
  PROJECT_CREATE: "PROJECT_CREATE",
  PROJECT_UPDATE: "PROJECT_UPDATE",
  PROJECT_DELETE: "PROJECT_DELETE",
  PROJECT_PUBLISH: "PROJECT_PUBLISH",

  // Service
  SERVICE_CREATE: "SERVICE_CREATE",
  SERVICE_UPDATE: "SERVICE_UPDATE",
  SERVICE_DELETE: "SERVICE_DELETE",

  // Order
  ORDER_CREATE: "ORDER_CREATE",
  ORDER_UPDATE: "ORDER_UPDATE",
  ORDER_DELETE: "ORDER_DELETE",
  ORDER_STATUS_CHANGE: "ORDER_STATUS_CHANGE",

  // Payment
  PAYMENT_CREATE: "PAYMENT_CREATE",
  PAYMENT_UPDATE: "PAYMENT_UPDATE",
  PAYMENT_PROCESS: "PAYMENT_PROCESS",

  // Settings
  SETTINGS_UPDATE: "SETTINGS_UPDATE",
  SETTINGS_DELETE: "SETTINGS_DELETE",

  // Security
  SUSPICIOUS_LOGIN_ATTEMPT: "SUSPICIOUS_LOGIN_ATTEMPT",
  UNAUTHORIZED_ACCESS_ATTEMPT: "UNAUTHORIZED_ACCESS_ATTEMPT",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
} as const;

/**
 * Get audit logs for a user
 */
export async function getUserAuditLogs(
  userId: string,
  limit: number = 100,
  offset: number = 0,
) {
  return await prisma.auditLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

/**
 * Get audit logs for a specific action
 */
export async function getActionAuditLogs(
  action: string,
  limit: number = 100,
  offset: number = 0,
) {
  return await prisma.auditLog.findMany({
    where: { action },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

/**
 * Get recent failed attempts (security monitoring)
 */
export async function getFailedAttempts(
  minutes: number = 60,
  limit: number = 50,
) {
  const since = new Date(Date.now() - minutes * 60 * 1000);
  return await prisma.auditLog.findMany({
    where: {
      status: "FAILED",
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/**
 * Clean up old audit logs (retention policy)
 * Keep logs for 90 days
 */
export async function cleanupOldAuditLogs(
  daysToKeep: number = 90,
): Promise<number> {
  const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);

  const result = await prisma.auditLog.deleteMany({
    where: {
      createdAt: { lt: cutoffDate },
    },
  });

  return result.count;
}
