import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const ORTHANC_URL = process.env.ORTHANC_URL || "http://localhost:8042";
  const ORTHANC_USERNAME = process.env.ORTHANC_USERNAME || "orthanc";
  const ORTHANC_PASSWORD = process.env.ORTHANC_PASSWORD || "orthanc";

  const dicomWebPath = path.join("/");
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${ORTHANC_URL}/dicom-web/${dicomWebPath}${searchParams ? `?${searchParams}` : ""}`;

  try {
    const authHeader =
      "Basic " +
      Buffer.from(`${ORTHANC_USERNAME}:${ORTHANC_PASSWORD}`).toString("base64");

    const response = await fetch(url, {
      headers: {
        Authorization: authHeader,
        Accept: request.headers.get("Accept") || "application/json",
      },
    });

    if (!response.ok) {
      return new NextResponse("Error fetching from Orthanc DICOMweb", {
        status: response.status,
      });
    }

    const contentType = response.headers.get("content-type") || "application/json";
    const body = await response.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("[ORTHANC_DICOMWEB_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
