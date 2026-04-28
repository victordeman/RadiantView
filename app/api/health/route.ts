import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const health: {
    status: string;
    timestamp: string;
    services: {
      database: { status: string; latency?: number; error?: string };
      orthanc: { status: string; latency?: number; error?: string };
    };
    version: string;
  } = {
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      database: { status: "unknown" },
      orthanc: { status: "unknown" },
    },
    version: process.env.npm_package_version || "1.0.0",
  };

  // Check database
  const dbStart = Date.now();
  try {
    await db.$queryRaw`SELECT 1`;
    health.services.database = {
      status: "connected",
      latency: Date.now() - dbStart,
    };
  } catch (error) {
    health.status = "degraded";
    health.services.database = {
      status: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }

  // Check Orthanc
  const orthancUrl = process.env.ORTHANC_URL || process.env.NEXT_PUBLIC_ORTHANC_URL;
  if (orthancUrl) {
    const orthancStart = Date.now();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${orthancUrl}/system`, { signal: controller.signal });
      clearTimeout(timeout);
      health.services.orthanc = {
        status: res.ok ? "connected" : "error",
        latency: Date.now() - orthancStart,
      };
    } catch {
      health.services.orthanc = {
        status: "disconnected",
        latency: Date.now() - orthancStart,
      };
    }
  } else {
    health.services.orthanc = { status: "not_configured" };
  }

  const httpStatus = health.status === "ok" ? 200 : 503;
  return NextResponse.json(health, { status: httpStatus });
}
