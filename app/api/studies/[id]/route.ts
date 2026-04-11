import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const study = await db.study.findUnique({
      where: { id },
      include: { patient: true },
    });

    if (!study) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(study);
  } catch (error) {
    console.error("[STUDY_GET]", error);
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
    const { accessionNumber, modality, description, studyDate, status } = body;

    const study = await db.study.update({
      where: { id },
      data: {
        accessionNumber,
        modality,
        description,
        studyDate: studyDate ? new Date(studyDate) : undefined,
        status,
      },
    });

    return NextResponse.json(study);
  } catch (error) {
    console.error("[STUDY_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.study.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[STUDY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
