import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { logAudit } from "@/lib/audit";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = session.user as { id: string; role?: string };
    if (currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { role, name } = body;

    // Prevent self-role-change (same pattern as self-deletion check in DELETE)
    if (role && id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot change your own role" },
        { status: 400 }
      );
    }

    const allowedRoles = ["RADIOLOGIST", "CLINICIAN", "TECH", "ADMIN"];
    if (role && !allowedRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role value" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (role) updateData.role = role;
    if (name) updateData.name = name;

    const user = await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    await logAudit({
      userId: session.user.id,
      action: "USER_UPDATED",
      resource: `User ${id}`,
      details: `Updated: ${[role && `role=${role}`, name && `name=${name}`].filter(Boolean).join(", ")}`,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_PUT]", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = session.user as { id: string; role?: string };
    if (currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Prevent self-deletion
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Use interactive transaction to atomically check reports/comments + delete
    await db.$transaction(async (tx) => {
      const reportCount = await tx.report.count({ where: { authorId: id } });
      const commentCount = await tx.reportComment.count({ where: { authorId: id } });
      const auditLogCount = await tx.auditLog.count({ where: { userId: id } });
      if (reportCount > 0 || commentCount > 0 || auditLogCount > 0) {
        const parts: string[] = [];
        if (reportCount > 0) parts.push(`${reportCount} report(s)`);
        if (commentCount > 0) parts.push(`${commentCount} comment(s)`);
        if (auditLogCount > 0) parts.push(`${auditLogCount} audit log(s)`);
        throw new Error(`HAS_REFERENCES:${parts.join(" and ")}`);
      }
      await tx.user.delete({ where: { id } });
    });

    await logAudit({
      userId: session.user.id,
      action: "USER_DELETED",
      resource: `User ${id}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("HAS_REFERENCES:")) {
      const detail = error.message.replace("HAS_REFERENCES:", "");
      return NextResponse.json(
        { error: `Cannot delete user with ${detail}. Reassign or archive them first.` },
        { status: 400 }
      );
    }
    console.error("[USER_DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
