import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const studies = await db.study.findMany({
      include: { patient: true },
      orderBy: { studyDate: "desc" },
    });
    return NextResponse.json(studies);
  } catch (error) {
    console.error("[STUDIES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studyInstanceUid, patientId, accessionNumber, modality, description, studyDate, orthancId, status } = body;

    if (!studyInstanceUid || !patientId || !modality || !studyDate) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const study = await db.study.create({
      data: {
        studyInstanceUid,
        patientId,
        accessionNumber,
        modality,
        description,
        studyDate: new Date(studyDate),
        orthancId,
        status,
      },
    });

    return NextResponse.json(study);
  } catch (error) {
    console.error("[STUDIES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
