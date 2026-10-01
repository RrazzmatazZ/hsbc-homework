import { NextResponse } from "next/server";

import type { PropertyFeatures } from "@/lib/property-fields";

const predictionServiceUrl =
  process.env.PREDICTION_SERVICE_URL ?? "http://localhost:8000";

type PredictionRequest = {
  features: PropertyFeatures;
};

export async function POST(request: Request) {
  try {
    const { features } = (await request.json()) as PredictionRequest;
    const response = await fetch(`${predictionServiceUrl}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          square_footage: features.squareFootage,
          bedrooms: features.bedrooms,
          bathrooms: features.bathrooms,
          year_built: features.yearBuilt,
          lot_size: features.lotSize,
          distance_to_city_center: features.distanceToCityCenter,
          school_rating: features.schoolRating,
        },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Prediction service returned an error." },
        { status: response.status },
      );
    }

    const data = (await response.json()) as { predictions?: number[] };
    const predictedPrice = data.predictions?.[0];

    if (typeof predictedPrice !== "number") {
      return NextResponse.json(
        { message: "Prediction service returned an invalid response." },
        { status: 502 },
      );
    }

    return NextResponse.json({ predictedPrice });
  } catch {
    return NextResponse.json(
      { message: "Prediction service is unavailable." },
      { status: 502 },
    );
  }
}
