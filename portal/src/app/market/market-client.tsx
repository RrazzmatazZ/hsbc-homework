"use client";

import { type FormEvent, useEffect, useState } from "react";

import { useErrorWarning } from "@/hooks/use-error-warning";

import { MarketStatistics } from "./market-statistics";
import {
  MARKET_FILTER_FIELDS,
  type PropertyFilter,
  type PropertyFilterField,
} from "./property-filter";
import { PropertyData } from "./property-data";

type MarketDataProps = {
  filter: PropertyFilter;
};

export type MarketSummaryData = {
  propertyCount: number;
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
  averagePricePerSquareFoot: number;
};

type MarketClientProps = {
  initialSummary: MarketSummaryData | null;
};

type MarketSummaryProps = MarketDataProps & MarketClientProps;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const formatCompactPrice = (value: number) => `$${Math.round(value / 1000)}k`;

function readBoundary(formData: FormData, field: PropertyFilterField, boundary: "from" | "to") {
  const value = formData.get(`${field}.${boundary}`);
  if (typeof value !== "string" || value.trim() === "") return undefined;
  return Number(value);
}

function MarketSummary({ filter, initialSummary }: MarketSummaryProps) {
  const [summary, setSummary] = useState<MarketSummaryData | null>(initialSummary);
  const [loading, setLoading] = useState(initialSummary === null);
  const { showErrorMsg } = useErrorWarning();
  const filterCount = Object.keys(filter).length;
  const usesInitialSummary = filterCount === 0 && initialSummary !== null;
  const displayedSummary = usesInitialSummary ? initialSummary : summary;
  const displayedLoading = usesInitialSummary ? false : loading;

  useEffect(() => {
    if (filterCount === 0 && initialSummary !== null) return;

    const controller = new AbortController();

    async function load() {
      setLoading(true);
      try {
        const response = await fetch("/api/analysis/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filter: filterCount > 0 ? filter : undefined,
          }),
          signal: controller.signal,
        });

        if (!response.ok) throw new Error();
        setSummary((await response.json()) as MarketSummaryData);
      } catch {
        if (!controller.signal.aborted) {
          setSummary(null);
          showErrorMsg("Unable to load market summary.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void load();
    return () => controller.abort();
  }, [filter, filterCount, initialSummary, showErrorMsg]);

  const metrics = [
    ["Properties", displayedSummary?.propertyCount.toLocaleString("en-US")],
    ["Average price", displayedSummary && currencyFormatter.format(displayedSummary.averagePrice)],
    [
      "Price range",
      displayedSummary && `${formatCompactPrice(displayedSummary.minPrice)} – ${formatCompactPrice(displayedSummary.maxPrice)}`,
    ],
    ["Price per sq ft", displayedSummary && currencyFormatter.format(displayedSummary.averagePricePerSquareFoot)],
  ];

  return (
    <section
      className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      aria-label={`Market summary, ${filterCount === 0 ? "all properties" : `${filterCount} filters applied`}`}
    >
      {metrics.map((metric) => (
        <article key={metric[0]} className="card p-4">
          <p className="text-sm font-medium text-slate-500">{metric[0]}</p>
          <p className="mt-3 text-2xl font-semibold text-slate-950">
            {displayedLoading ? "…" : metric[1] || "—"}
          </p>
        </article>
      ))}
    </section>
  );
}

export default function MarketClient({ initialSummary }: MarketClientProps) {
  const [filter, setFilter] = useState<PropertyFilter>({});
  const [page, setPage] = useState(0);
  const { showErrorMsg } = useErrorWarning();

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextFilter: PropertyFilter = {};

    for (const { field, label } of MARKET_FILTER_FIELDS) {
      const from = readBoundary(formData, field, "from");
      const to = readBoundary(formData, field, "to");

      if (from !== undefined && to !== undefined && from > to) {
        showErrorMsg(`${label} minimum must be less than or equal to its maximum.`, "Invalid filter range");
        return;
      }

      if (from !== undefined || to !== undefined) {
        nextFilter[field] = { from, to };
      }
    }

    setPage(0);
    setFilter(nextFilter);
  }

  return (
    <div className="page-shell">
      <main className="page-container">
        <section className="card" aria-labelledby="filters-heading">
          <div className="border-b border-slate-200 px-4 py-4">
            <h2 id="filters-heading" className="section-title">Market filters</h2>
          </div>
          <form
            className="p-4"
            onSubmit={applyFilters}
            onReset={() => {
              setPage(0);
              setFilter({});
            }}
          >
            <div className="grid gap-x-6 gap-y-3 lg:grid-cols-2">
              {MARKET_FILTER_FIELDS.map(({ field, label, min, max, step }) => (
                <div
                  key={field}
                  className="grid min-w-0 gap-2 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:items-center"
                  role="group"
                  aria-labelledby={`${field}-filter-label`}
                >
                  <span id={`${field}-filter-label`} className="item-title">
                    {label}
                  </span>
                  <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                    <label className="min-w-0">
                      <span className="sr-only">Minimum {label.toLowerCase()}</span>
                      <input
                        name={`${field}.from`}
                        type="number"
                        min={min}
                        max={max}
                        step={step}
                        placeholder="From"
                        className="form-control min-w-0"
                      />
                    </label>
                    <span className="text-slate-400" aria-hidden="true">–</span>
                    <label className="min-w-0">
                      <span className="sr-only">Maximum {label.toLowerCase()}</span>
                      <input
                        name={`${field}.to`}
                        type="number"
                        min={min}
                        max={max}
                        step={step}
                        placeholder="To"
                        className="form-control min-w-0"
                      />
                    </label>
                  </div>
                </div>
              ))}
              <div className="flex justify-end gap-2">
                <button type="reset" className="secondary-button px-4 py-2">
                  Reset all
                </button>
                <button type="submit" className="primary-button">
                  Apply filters
                </button>
              </div>
            </div>
          </form>
        </section>

        <MarketSummary filter={filter} initialSummary={initialSummary} />

        <PropertyData filter={filter} page={page} onPageRequest={setPage} />

        <MarketStatistics filter={filter} />
      </main>
    </div>
  );
}
