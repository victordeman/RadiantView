import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const orders = await db.order.findMany({
      where,
      include: {
        patient: {
          select: { name: true, patientId: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientId, modality, priority, referringDoc, notes } = body;

    if (!patientId) {
      return new NextResponse("Patient is required", { status: 400 });
    }

    // Auto-generate order number: ORD-YYYYMMDD-XXXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    const orderNumber = `ORD-${dateStr}-${randomSuffix}`;

    const order = await db.order.create({
      data: {
        orderNumber,
        patientId,
        modality,
        priority: priority || "ROUTINE",
        referringDoc,
        notes,
        status: "PENDING",
      },
      include: {
        patient: {
          select: { name: true, patientId: true },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
