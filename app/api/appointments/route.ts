import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const from = req.nextUrl.searchParams.get("from");
    const to = req.nextUrl.searchParams.get("to");

    const where: Record<string, unknown> = {};
    if (from || to) {
      where.startTime = {};
      if (from) (where.startTime as Record<string, Date>).gte = new Date(from);
      if (to) (where.startTime as Record<string, Date>).lte = new Date(to);
    }

    const appointments = await db.appointment.findMany({
      where,
      include: { patient: true },
      orderBy: { startTime: "asc" },
    });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("[APPOINTMENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { startTime, endTime, status, patientId, modality, notes } = body;

    if (!startTime || !endTime || !patientId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const appointment = await db.appointment.create({
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status,
        patientId,
        modality,
        notes,
      },
      include: { patient: true },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("[APPOINTMENTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
