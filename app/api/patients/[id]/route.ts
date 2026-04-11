import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const patient = await db.patient.findUnique({
      where: { id },
      include: {
        appointments: true,
        studies: true,
        orders: true,
      },
    });

    if (!patient) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error("[PATIENT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { patientId, firstName, lastName, dob, gender, email, phone, address } = body;

    const patient = await db.patient.update({
      where: { id },
      data: {
        patientId,
        firstName,
        lastName,
        dob: dob ? new Date(dob) : undefined,
        gender,
        email,
        phone,
        address,
      },
    });

    return NextResponse.json(patient);
  } catch (error) {
    console.error("[PATIENT_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.patient.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[PATIENT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
