import { NextResponse } from "next/server";

export async function GET() {
  const ORTHANC_URL = process.env.ORTHANC_URL || "http://localhost:8042";
  const ORTHANC_USERNAME = process.env.ORTHANC_USERNAME || "orthanc";
  const ORTHANC_PASSWORD = process.env.ORTHANC_PASSWORD || "orthanc";

  try {
    const authHeader = "Basic " + Buffer.from(`${ORTHANC_USERNAME}:${ORTHANC_PASSWORD}`).toString("base64");

    const response = await fetch(`${ORTHANC_URL}/studies?expand`, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      return new NextResponse("Error fetching from Orthanc", { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[ORTHANC_STUDIES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
