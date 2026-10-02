"use client";

import { useEffect, useState } from "react";

import { useErrorWarning } from "@/hooks/use-error-warning";

import type { PropertyFilter } from "./property-filter";
import { AreaDistribution } from "./statistics/area-distribution";
import { BedroomDistribution } from "./statistics/bedroom-distribution";
import { PriceDistribution } from "./statistics/price-distribution";
import { SchoolRatingDistribution } from "./statistics/school-rating-distribution";
import type { SegmentBucket } from "./statistics/segment-chart";

const fields = ["price", "squareFootage", "bedrooms", "schoolRating"] as const;
type SegmentField = (typeof fields)[number];
type StatisticsData = Record<SegmentField, SegmentBucket[]>;

const emptyData: StatisticsData = {
  price: [],
  squareFootage: [],
  bedrooms: [],
  schoolRating: [],
};

export function MarketStatistics({ filter }: { filter: PropertyFilter }) {
  const [data, setData] = useState<StatisticsData>(emptyData);
  const [loading, setLoading] = useState(true);
  const { showErrorMsg } = useErrorWarning();

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      try {
        const responses = await Promise.all(
          fields.map((segmentBy) =>
            fetch("/api/analysis/segments", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                segmentBy,
                bucketCount: segmentBy === "bedrooms" ? 3 : 6,
                filter: Object.keys(filter).length > 0 ? filter : undefined,
              }),
              signal: controller.signal,
            }),
          ),
        );

        if (responses.some((response) => !response.ok)) throw new Error();
        const results = await Promise.all(
          responses.map((response) => response.json() as Promise<{ buckets: SegmentBucket[] }>),
        );

        setData(Object.fromEntries(fields.map((field, index) => [field, results[index].buckets])) as StatisticsData);
      } catch {
        if (!controller.signal.aborted) {
          setData(emptyData);
          showErrorMsg("Unable to load market statistics.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void load();
    return () => controller.abort();
  }, [filter, showErrorMsg]);

  return (
    <details open className="group collapsible-card">
      <summary className="collapsible-card-summary">
        <h2 className="section-title">Market statistics</h2>
        <span className="text-sm text-slate-500 group-open:hidden">Show</span>
        <span className="hidden text-sm text-slate-500 group-open:inline">Hide</span>
      </summary>

      <section className="grid gap-3 border-t border-slate-200 p-3 lg:grid-cols-2">
        {loading ? (
          <p className="col-span-full py-12 text-center text-sm text-slate-500">Loading statistics…</p>
        ) : (
          <>
            <PriceDistribution buckets={data.price} />
            <AreaDistribution buckets={data.squareFootage} />
            <BedroomDistribution buckets={data.bedrooms} />
            <SchoolRatingDistribution buckets={data.schoolRating} />
          </>
        )}
      </section>
    </details>
  );
}
