import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get("search");
    const patients = await db.patient.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { patientId: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      include: {
        studies: {
          select: { id: true, studyDate: true, modality: true, studyInstanceUid: true, studyDescription: true },
          orderBy: { studyDate: "desc" },
        },
      },
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
