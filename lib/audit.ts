import { db } from "@/lib/db";

export type AuditAction =
  | "USER_LOGIN"
  | "USER_LOGOUT"
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_DELETED"
  | "REPORT_CREATED"
  | "REPORT_UPDATED"
  | "REPORT_SIGNED"
  | "REPORT_DELETED"
  | "VIEWER_ACCESS"
  | "PATIENT_CREATED"
  | "ORDER_CREATED";

export async function logAudit(params: {
  userId: string;
  action: AuditAction;
  resource: string;
  details?: string;
}) {
  try {
    await db.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        resource: params.resource,
        details: params.details || null,
      },
    });
  } catch (error) {
    // Non-critical — don't let audit failures break the app
    console.error("[AUDIT_LOG]", error);
  }
}
