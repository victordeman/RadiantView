import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ORTHANC_URL = process.env.ORTHANC_URL || "http://localhost:8042";
  const ORTHANC_USERNAME = process.env.ORTHANC_USERNAME || "orthanc";
  const ORTHANC_PASSWORD = process.env.ORTHANC_PASSWORD || "orthanc";

  try {
    const authHeader = "Basic " + Buffer.from(`${ORTHANC_USERNAME}:${ORTHANC_PASSWORD}`).toString("base64");
    const response = await fetch(`${ORTHANC_URL}/studies/${id}`, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      return new NextResponse("Study not found", { status: 404 });
    }

    const study = await response.json();
    
    // Transform single study
    const transformedStudy = {
      id: study.ID,
      patientName: study.PatientMainDicomTags?.PatientName || "Unknown",
      patientId: study.PatientMainDicomTags?.PatientID || "Unknown",
      accessionNumber: study.MainDicomTags?.AccessionNumber || "N/A",
      modality: study.MainDicomTags?.ModalitiesInStudy || "N/A",
      studyDate: study.MainDicomTags?.StudyDate || "",
      studyDescription: study.MainDicomTags?.StudyDescription || "",
      status: "Available",
      instanceCount: study.Instances?.length || 0,
      lastUpdate: study.LastUpdate,
    };

    return NextResponse.json(transformedStudy);
  } catch (error) {
    console.error("[STUDY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ORTHANC_URL = process.env.ORTHANC_URL || "http://localhost:8042";
  const ORTHANC_USERNAME = process.env.ORTHANC_USERNAME || "orthanc";
  const ORTHANC_PASSWORD = process.env.ORTHANC_PASSWORD || "orthanc";

  try {
    const authHeader = "Basic " + Buffer.from(`${ORTHANC_USERNAME}:${ORTHANC_PASSWORD}`).toString("base64");
    const response = await fetch(`${ORTHANC_URL}/studies/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      return new NextResponse("Error deleting study from Orthanc", { status: response.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[STUDY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
