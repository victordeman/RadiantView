import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const appointments = await db.appointment.findMany({
      include: { patient: true },
      orderBy: { start: "asc" },
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
    const { patientId, start, end, status, reason, notes } = body;

    if (!patientId || !start || !end) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const appointment = await db.appointment.create({
      data: {
        patientId,
        start: new Date(start),
        end: new Date(end),
        status,
        reason,
        notes,
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("[APPOINTMENTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
