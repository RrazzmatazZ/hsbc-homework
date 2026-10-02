import { NextResponse } from "next/server";

import { ANALYSIS_SERVICE_URL } from "@/lib/config/service-config";

type RouteContext = {
  params: Promise<{ format: string }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  const { format } = await params;

  if (format !== "csv" && format !== "pdf") {
    return NextResponse.json({ message: "Unsupported export format." }, { status: 404 });
  }

  try {
    const response = await fetch(`${ANALYSIS_SERVICE_URL}/export/${format}`, {
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

    return new Response(await response.arrayBuffer(), {
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/octet-stream",
        "Content-Disposition":
          response.headers.get("Content-Disposition") ??
          `attachment; filename="market-report.${format}"`,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Analysis service is unavailable." },
      { status: 502 },
    );
  }
}
