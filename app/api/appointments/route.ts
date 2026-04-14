import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const appointments = await db.appointment.findMany({
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
    const { startTime, endTime, status, patientId } = body;

    if (!startTime || !endTime || !patientId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const appointment = await db.appointment.create({
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status,
        patientId,
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("[APPOINTMENTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
