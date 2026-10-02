import { NextResponse } from "next/server";
import { ANALYSIS_SERVICE_URL } from "@/lib/config/service-config";

export async function POST(request: Request) {
  try {
    const response = await fetch(`${ANALYSIS_SERVICE_URL}/analysis/segments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(await request.json()),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Analysis service returned an error." },
        { status: response.status },
      );
    }

    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json(
      { message: "Analysis service is unavailable." },
      { status: 502 },
    );
  }
}
