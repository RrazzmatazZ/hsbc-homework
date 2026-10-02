import { NextResponse } from "next/server";

import { PREDICTION_SERVICE_URL } from "@/lib/config/service-config";

export async function GET() {
  try {
    const response = await fetch(`${PREDICTION_SERVICE_URL}/health`, {
      cache: "no-store",
    });

    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Prediction service is unavailable." },
      { status: 502 },
    );
  }
}
