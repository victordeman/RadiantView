import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const patients = await db.patient.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(patients);
  } catch (error) {
    console.error("[PATIENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientId, name, dob, gender } = body;

    if (!patientId || !name || !dob || !gender) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const patient = await db.patient.create({
      data: {
        patientId,
        name,
        dob: new Date(dob),
        gender,
      },
    });

    return NextResponse.json(patient);
  } catch (error) {
    console.error("[PATIENTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
