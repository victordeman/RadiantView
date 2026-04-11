import { NextResponse } from "next/server";
import { WorklistCard } from "@/lib/types/worklist";

export async function GET() {
  const ORTHANC_URL = process.env.ORTHANC_URL;
  const ORTHANC_USERNAME = process.env.ORTHANC_USERNAME;
  const ORTHANC_PASSWORD = process.env.ORTHANC_PASSWORD;

  if (!ORTHANC_URL) {
    return new NextResponse("ORTHANC_URL not configured", { status: 500 });
  }

  try {
    const headers: Record<string, string> = {};
    if (ORTHANC_USERNAME && ORTHANC_PASSWORD) {
      headers["Authorization"] = `Basic ${Buffer.from(`${ORTHANC_USERNAME}:${ORTHANC_PASSWORD}`).toString("base64")}`;
    }

    const response = await fetch(`${ORTHANC_URL}/studies?expand`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Orthanc error: ${response.statusText}`);
    }

    const studies = await response.json();

    interface OrthancStudy {
      ID: string;
      MainDicomTags: Record<string, string>;
      PatientMainDicomTags: Record<string, string>;
      ModalitiesInStudy: string[];
      Instances: string[];
    }

    // Transform Orthanc study objects to WorklistCard shape
    const worklist: WorklistCard[] = studies.map((study: OrthancStudy) => {
      const mainDicomTags = study.MainDicomTags || {};
      const patientMainDicomTags = study.PatientMainDicomTags || {};

      // Formatting date: Orthanc often provides 20231027
      const rawDate = mainDicomTags.StudyDate || "";
      const formattedDate = rawDate.length === 8
        ? `${rawDate.substring(0, 4)}-${rawDate.substring(4, 6)}-${rawDate.substring(6, 8)}`
        : rawDate;

      return {
        id: study.ID,
        patientId: patientMainDicomTags.PatientID || "N/A",
        patientName: patientMainDicomTags.PatientName || "Anonymous",
        dob: patientMainDicomTags.PatientBirthDate || "",
        gender: patientMainDicomTags.PatientSex || "O",
        accessionNumber: mainDicomTags.AccessionNumber || "N/A",
        modality: study.ModalitiesInStudy?.[0] || "OT",
        studyDate: formattedDate,
        studyTime: mainDicomTags.StudyTime,
        description: mainDicomTags.StudyDescription || "No Description",
        status: "UNREPORTED", // Orthanc doesn't track reporting status by default
        priority: "ROUTINE",
        institution: mainDicomTags.InstitutionName,
        instancesCount: study.Instances?.length || 0,
      };
    });

    return NextResponse.json(worklist);
  } catch (error) {
    console.error("[ORTHANC_STUDIES_PROXY]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
