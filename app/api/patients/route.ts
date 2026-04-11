import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const patients = await db.patient.findMany({
      orderBy: { createdAt: "desc" },
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
    const { patientId, firstName, lastName, dob, gender, email, phone, address } = body;

    if (!patientId || !firstName || !lastName || !dob || !gender) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const patient = await db.patient.create({
      data: {
        patientId,
        firstName,
        lastName,
        dob: new Date(dob),
        gender,
        email,
        phone,
        address,
      },
    });

    return NextResponse.json(patient);
  } catch (error) {
    console.error("[PATIENTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
