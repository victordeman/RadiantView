import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

interface SearchResult {
  id: string;
  type: "patient" | "study" | "report" | "order";
  title: string;
  subtitle: string;
  href: string;
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json([]);
    }

    const results: SearchResult[] = [];

    // Search patients
    const patients = await db.patient.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { patientId: { contains: q, mode: "insensitive" } },
      ],
    },
    take: 5,
  });
  for (const p of patients) {
    results.push({
      id: p.id,
      type: "patient",
      title: p.name,
      subtitle: p.patientId,
      href: "/patients",
    });
  }

  // Search studies
  const studies = await db.study.findMany({
    where: {
      OR: [
        { studyDescription: { contains: q, mode: "insensitive" } },
        { modality: { contains: q, mode: "insensitive" } },
        { patient: { name: { contains: q, mode: "insensitive" } } },
      ],
    },
    take: 5,
    include: { patient: { select: { name: true } } },
  });
  for (const s of studies) {
    results.push({
      id: s.id,
      type: "study",
      title: s.studyDescription || `${s.modality} Study`,
      subtitle: s.patient.name,
      href: `/viewer/${s.studyInstanceUid}`,
    });
  }

  // Search reports
  const reports = await db.report.findMany({
    where: {
      OR: [
        { templateName: { contains: q, mode: "insensitive" } },
        { findings: { contains: q, mode: "insensitive" } },
        { study: { patient: { name: { contains: q, mode: "insensitive" } } } },
      ],
    },
    take: 5,
    include: {
      study: { include: { patient: { select: { name: true } } } },
    },
  });
  for (const r of reports) {
    results.push({
      id: r.id,
      type: "report",
      title: r.templateName || "Report",
      subtitle: `${r.study.patient.name} — ${r.status}`,
      href: `/reports/${r.id}`,
    });
  }

  // Search orders
  const orders = await db.order.findMany({
    where: {
      OR: [
        { orderNumber: { contains: q, mode: "insensitive" } },
        { patient: { name: { contains: q, mode: "insensitive" } } },
        { referringDoc: { contains: q, mode: "insensitive" } },
      ],
    },
    take: 5,
    include: { patient: { select: { name: true } } },
  });
  for (const o of orders) {
    results.push({
      id: o.id,
      type: "order",
      title: o.orderNumber,
      subtitle: `${o.patient.name} — ${o.modality || "N/A"}`,
      href: "/orders",
    });
  }

    return NextResponse.json(results);
  } catch (error) {
    console.error("[SEARCH_GET]", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
