import { NextResponse } from "next/server";

const analysisServiceUrl =
  process.env.ANALYSIS_SERVICE_URL ?? "http://localhost:8080";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(`${analysisServiceUrl}/properties/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
