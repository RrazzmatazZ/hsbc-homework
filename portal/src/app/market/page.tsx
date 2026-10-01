"use client";

import { type FormEvent, useState } from "react";

import { useErrorWarning } from "@/hooks/use-error-warning";

import {
  MARKET_FILTER_FIELDS,
  type PropertyFilter,
  type PropertyFilterField,
} from "./property-filter";
import { PropertyData } from "./property-data";

const metrics = ["Properties", "Average price", "Median price", "Price per sq ft"];
const charts = [
  ["Price distribution", "Understand how property prices are spread across the dataset."],
  ["Area vs price", "Explore the relationship between square footage and value."],
  ["Price by bedrooms", "Compare average prices across property segments."],
  ["School rating impact", "Analyse how school ratings relate to market value."],
] as const;

type MarketDataProps = {
  filter: PropertyFilter;
};

function readBoundary(formData: FormData, field: PropertyFilterField, boundary: "from" | "to") {
  const value = formData.get(`${field}.${boundary}`);
  if (typeof value !== "string" || value.trim() === "") return undefined;
  return Number(value);
}

function MarketSummary({ filter }: MarketDataProps) {
  const filterCount = Object.keys(filter).length;

  return (
    <section
      className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      aria-label={`Market summary, ${filterCount === 0 ? "all properties" : `${filterCount} filters applied`}`}
    >
      {metrics.map((metric) => (
        <article key={metric} className="card p-4">
          <p className="text-sm font-medium text-slate-500">{metric}</p>
          <p className="mt-3 text-2xl font-semibold text-slate-950">—</p>
        </article>
      ))}
    </section>
  );
}

function MarketStatistics({ filter }: MarketDataProps) {
  const filterCount = Object.keys(filter).length;

  return (
    <details open className="group collapsible-card">
      <summary className="collapsible-card-summary">
        <div>
          <h2 className="section-title">Market statistics</h2>
        </div>
        <span className="text-sm text-slate-500 group-open:hidden">Show</span>
        <span className="hidden text-sm text-slate-500 group-open:inline">Hide</span>
      </summary>

      <section
        className="grid gap-4 border-t border-slate-200 p-4 lg:grid-cols-2"
        aria-label={`Market visualisations, ${filterCount === 0 ? "all properties" : `${filterCount} filters applied`}`}
      >
        {charts.map(([title]) => (
          <article key={title} className="min-h-64 border border-slate-200 p-5">
            <h3 className="item-title">{title}</h3>
            <div
              className="mt-6 flex h-32 items-end gap-3 border border-dashed border-slate-200 bg-slate-50 px-6 pb-4 pt-7"
              aria-hidden="true"
            />
          </article>
        ))}
      </section>
    </details>
  );
}

export default function MarketPage() {
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
              <div className="flex justify-end  gap-2">
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

        <MarketSummary filter={filter} />

        <PropertyData filter={filter} page={page} onPageRequest={setPage} />

        <MarketStatistics filter={filter} />
      </main>
    </div>
  );
}
