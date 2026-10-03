import { ANALYSIS_SERVICE_URL } from "@/lib/config/service-config";

import MarketClient, { type MarketSummaryData } from "./market-client";

export const dynamic = "force-dynamic";

async function loadInitialSummary(): Promise<MarketSummaryData | null> {
  try {
    const response = await fetch(`${ANALYSIS_SERVICE_URL}/analysis/summary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
      cache: "no-store",
    });

    if (!response.ok) return null;
    return (await response.json()) as MarketSummaryData;
  } catch {
    // Fall back to the existing client-side BFF request when the backend is
    // temporarily unavailable during the server render.
    return null;
  }
}

export default async function MarketPage() {
  const initialSummary = await loadInitialSummary();

  return <MarketClient initialSummary={initialSummary} />;
}
