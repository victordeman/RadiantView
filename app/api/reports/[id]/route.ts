import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const report = await db.report.findUnique({
      where: { id },
      include: {
        study: {
          include: { patient: true },
        },
        author: {
          select: { id: true, name: true, email: true },
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("[REPORT_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if report is finalized before allowing modifications
    const existingReport = await db.report.findUnique({
      where: { id },
      select: { status: true },
    });
    if (!existingReport) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }
    if (existingReport.status === "FINAL") {
      return NextResponse.json(
        { error: "Cannot modify a finalized report" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { findings, impression, recommendation, status, templateName } = body;

    const updateData: Record<string, unknown> = {};
    if (findings !== undefined) updateData.findings = findings;
    if (impression !== undefined) updateData.impression = impression;
    if (recommendation !== undefined) updateData.recommendation = recommendation;
    if (templateName !== undefined) updateData.templateName = templateName;
    if (status !== undefined) {
      updateData.status = status;
      if (status === "FINAL") {
        updateData.signedAt = new Date();
      }
    }

    const report = await db.report.update({
      where: { id },
      data: updateData,
      include: {
        study: {
          include: { patient: true },
        },
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("[REPORT_PUT]", error);
    return NextResponse.json(
      { error: "Failed to update report" },
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

    const { id } = await params;

    // Prevent deletion of finalized reports
    const existingReport = await db.report.findUnique({
      where: { id },
      select: { status: true },
    });
    if (!existingReport) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }
    if (existingReport.status === "FINAL") {
      return NextResponse.json(
        { error: "Cannot delete a finalized report" },
        { status: 400 }
      );
    }

    await db.report.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[REPORT_DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete report" },
      { status: 500 }
    );
  }
}
