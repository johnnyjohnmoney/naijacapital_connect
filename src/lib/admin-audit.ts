import { prisma } from "@/lib/prisma";

/**
 * Admin Audit Logging Utility
 * Logs all administrative actions for accountability and compliance
 */

export interface AdminAuditLogData {
  adminId: string;
  action: string;
  targetType:
    | "BUSINESS"
    | "USER"
    | "WITHDRAWAL"
    | "REPORT"
    | "SETTINGS"
    | "OTHER";
  targetId: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log an admin action to the audit trail
 */
export async function logAdminAction(data: AdminAuditLogData): Promise<void> {
  try {
    await prisma.adminAuditLog.create({
      data: {
        adminId: data.adminId,
        action: data.action,
        targetType: data.targetType,
        targetId: data.targetId,
        details: data.details ? JSON.stringify(data.details) : null,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
      },
    });
  } catch (error) {
    // Log error but don't throw - audit logging should not block operations
    console.error("Failed to log admin action:", error);
  }
}

/**
 * Extract IP address from request headers
 */
export function getIpAddress(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return realIp || undefined;
}

/**
 * Extract user agent from request headers
 */
export function getUserAgent(request: Request): string | undefined {
  return request.headers.get("user-agent") || undefined;
}

/**
 * Common admin action types
 */
export const AdminActions = {
  // Opportunity actions
  APPROVE_OPPORTUNITY: "APPROVE_OPPORTUNITY",
  REJECT_OPPORTUNITY: "REJECT_OPPORTUNITY",
  REQUEST_CHANGES_OPPORTUNITY: "REQUEST_CHANGES_OPPORTUNITY",
  SUSPEND_OPPORTUNITY: "SUSPEND_OPPORTUNITY",
  REINSTATE_OPPORTUNITY: "REINSTATE_OPPORTUNITY",
  FEATURE_OPPORTUNITY: "FEATURE_OPPORTUNITY",
  UNFEATURE_OPPORTUNITY: "UNFEATURE_OPPORTUNITY",

  // User actions
  SUSPEND_USER: "SUSPEND_USER",
  UNSUSPEND_USER: "UNSUSPEND_USER",
  BAN_USER: "BAN_USER",
  VERIFY_USER: "VERIFY_USER",
  UNVERIFY_USER: "UNVERIFY_USER",
  TERMINATE_USER_SESSION: "TERMINATE_USER_SESSION",

  // Financial actions
  APPROVE_WITHDRAWAL: "APPROVE_WITHDRAWAL",
  REJECT_WITHDRAWAL: "REJECT_WITHDRAWAL",
  PROCESS_REFUND: "PROCESS_REFUND",
  APPROVE_PAYOUT: "APPROVE_PAYOUT",
  HOLD_PAYOUT: "HOLD_PAYOUT",

  // Compliance actions
  REVIEW_REPORT: "REVIEW_REPORT",
  RESOLVE_REPORT: "RESOLVE_REPORT",
  DISMISS_REPORT: "DISMISS_REPORT",
  ESCALATE_REPORT: "ESCALATE_REPORT",

  // Configuration actions
  UPDATE_PLATFORM_SETTINGS: "UPDATE_PLATFORM_SETTINGS",
  ENABLE_FEATURE_FLAG: "ENABLE_FEATURE_FLAG",
  DISABLE_FEATURE_FLAG: "DISABLE_FEATURE_FLAG",
  UPDATE_EMAIL_TEMPLATE: "UPDATE_EMAIL_TEMPLATE",
} as const;
