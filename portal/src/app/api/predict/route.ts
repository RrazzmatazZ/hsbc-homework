import { NextResponse } from "next/server";
import type { PropertyFeatures } from "@/lib/property-fields";
import { PREDICTION_SERVICE_URL } from '@/lib/config/service-config'

type PredictionRequest = {
  features: PropertyFeatures;
};

type PredictionServiceResponse = {
  predictions?: number[];
  base_value?: number;
  contributions?: Array<{
    square_footage: number;
    bedrooms: number;
    bathrooms: number;
    year_built: number;
    lot_size: number;
    distance_to_city_center: number;
    school_rating: number;
  }>;
};

export async function POST(request: Request) {
  try {
    const { features } = (await request.json()) as PredictionRequest;
    const response = await fetch(`${PREDICTION_SERVICE_URL}/predict`, {
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

    const data = (await response.json()) as PredictionServiceResponse;
    const predictedPrice = data.predictions?.[0];
    const contribution = data.contributions?.[0];

    if (
      typeof predictedPrice !== "number" ||
      typeof data.base_value !== "number" ||
      !contribution
    ) {
      return NextResponse.json(
        { message: "Prediction service returned an invalid response." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      predictedPrice,
      basePrice: data.base_value,
      contributions: {
        squareFootage: contribution.square_footage,
        bedrooms: contribution.bedrooms,
        bathrooms: contribution.bathrooms,
        yearBuilt: contribution.year_built,
        lotSize: contribution.lot_size,
        distanceToCityCenter: contribution.distance_to_city_center,
        schoolRating: contribution.school_rating,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Prediction service is unavailable." },
      { status: 502 },
    );
  }
}
