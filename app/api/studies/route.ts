import { NextResponse } from "next/server";

export async function GET() {
  const host = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  try {
    // In a real Next.js app, we might want to fetch directly from Orthanc to avoid an extra network hop,
    // but the task specifically mentioned the proxy route.
    const response = await fetch(`${host}/api/orthanc/studies`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return new NextResponse("Error fetching studies", { status: response.status });
    }

    const studies = await response.json();

    interface OrthancStudy {
      ID: string;
      PatientMainDicomTags?: {
        PatientName?: string;
        PatientID?: string;
      };
      MainDicomTags?: {
        AccessionNumber?: string;
        ModalitiesInStudy?: string;
        StudyDate?: string;
        StudyDescription?: string;
      };
      Instances?: string[];
      LastUpdate?: string;
    }

    // Transform to OmegaAI worklist card shape
    const transformedStudies = studies.map((study: OrthancStudy) => ({
      id: study.ID,
      patientName: study.PatientMainDicomTags?.PatientName || "Unknown",
      patientId: study.PatientMainDicomTags?.PatientID || "Unknown",
      accessionNumber: study.MainDicomTags?.AccessionNumber || "N/A",
      modality: study.MainDicomTags?.ModalitiesInStudy || "N/A",
      studyDate: study.MainDicomTags?.StudyDate || "",
      studyDescription: study.MainDicomTags?.StudyDescription || "",
      status: "Available", // Placeholder status
      instanceCount: study.Instances?.length || 0,
      lastUpdate: study.LastUpdate,
    }));

    return NextResponse.json(transformedStudies);
  } catch (error) {
    console.error("[STUDIES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(_req: Request) {
  // Logic for creating/uploading a study (proxy to Orthanc /instances)
  // For now, returning a placeholder as the task mainly focused on CRUD and proxy
  return new NextResponse("Not implemented", { status: 501 });
}
