"use client";

import { useEffect, useState } from "react";

import { PropertyInput } from "@/components/property-input";
import {
  PropertyTable,
  type PropertySortField,
  type PropertyTableRow,
} from "@/components/property-table";
import { useErrorWarning } from "@/hooks/use-error-warning";
import { useLoading } from "@/hooks/use-loading";
import { PROPERTY_FIELDS } from "@/lib/property-fields";

import type { PropertyFilter } from "./property-filter";

type PropertyPage = {
  content: PropertyTableRow[];
  page: number;
  totalElements: number;
  totalPages: number;
};

type PropertySort = {
  field: PropertySortField;
  direction: "asc" | "desc";
};

const PAGE_SIZE = 10;
const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type PropertyDataProps = {
  filter: PropertyFilter;
  page: number;
  onPageRequest: (page: number) => void;
};

export function PropertyData({ filter, page, onPageRequest }: PropertyDataProps) {
  const [data, setData] = useState<PropertyPage | null>(null);
  const [sort, setSort] = useState<PropertySort>({ field: "id", direction: "asc" });
  const [selectedProperty, setSelectedProperty] = useState<PropertyTableRow | null>(null);
  const { showErrorMsg } = useErrorWarning();
  const { loading, runWithLoading } = useLoading(500, true);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const nextData = await runWithLoading(async () => {
          const response = await fetch("/api/properties", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              page,
              size: PAGE_SIZE,
              sortBy: sort.field,
              isASC: sort.direction === "asc",
              filter: Object.keys(filter).length > 0 ? filter : undefined,
            }),
            signal: controller.signal,
          });

          if (!response.ok) throw new Error();
          return (await response.json()) as PropertyPage;
        });

        if (!controller.signal.aborted) setData(nextData);
      } catch {
        if (!controller.signal.aborted) {
          showErrorMsg("Unable to load property data.");
        }
      }
    }

    void load();
    return () => controller.abort();
  }, [filter, page, runWithLoading, showErrorMsg, sort]);

  useEffect(() => {
    if (!selectedProperty) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedProperty(null);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedProperty]);

  return (
    <details open className="group collapsible-card">
      <summary className="collapsible-card-summary">
        <div>
          <h2 className="section-title">Property data</h2>
          <p className="supporting-text">
            {data ? `${data.totalElements} properties` : "Loading properties…"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {loading && data ? <span className="text-sm text-slate-500">Loading…</span> : null}
          <span className="text-sm text-slate-500 group-open:hidden">Show</span>
          <span className="hidden text-sm text-slate-500 group-open:inline">Hide</span>
        </div>
      </summary>

      <div className="border-t border-slate-200">
        <PropertyTable
          data={data?.content ?? []}
          page={data?.page ?? page}
          totalElements={data?.totalElements ?? 0}
          totalPages={data?.totalPages ?? 1}
          onPageRequest={onPageRequest}
          firstColumnLabel="ID"
          renderFirstColumn={(property) => property.id}
          firstColumnSortField="id"
          sort={{
            ...sort,
            onChange: (field) => {
              onPageRequest(0);
              setSort((current) => ({
                field,
                direction:
                  current.field === field && current.direction === "asc" ? "desc" : "asc",
              }));
            },
          }}
          loading={loading}
          minHeightClassName="min-h-130"
          rowAction={{
            label: "What-if",
            onClick: setSelectedProperty,
          }}
        />
      </div>

      {selectedProperty ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedProperty(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="what-if-title"
            className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto border border-slate-300 bg-white shadow-lg"
          >
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
              <h2 id="what-if-title" className="section-title">What-if analysis</h2>
              <button
                type="button"
                aria-label="Close what-if dialog"
                onClick={() => setSelectedProperty(null)}
                className="ml-4 px-2 py-1 text-xl leading-none text-slate-500 hover:text-slate-950"
              >
                ×
              </button>
            </div>

            <form onSubmit={(event) => event.preventDefault()}>
              <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                <p className="text-xs font-medium uppercase text-slate-500">Selected property</p>
                <div className="mt-2 flex flex-wrap gap-x-8 gap-y-1 text-sm">
                  <span>ID: {selectedProperty.id}</span>
                  <span>Current price: {priceFormatter.format(selectedProperty.price)}</span>
                </div>
              </div>

              <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
                {PROPERTY_FIELDS.map((field, index) => (
                  <PropertyInput
                    key={field.name}
                    {...field}
                    defaultValue={selectedProperty[field.name]}
                    containerClassName={index === PROPERTY_FIELDS.length - 1 ? "sm:col-span-2" : ""}
                    inputClassName={index === PROPERTY_FIELDS.length - 1 ? "sm:max-w-[calc(50%-0.5rem)]" : ""}
                  />
                ))}
              </div>

              <div className="border-y border-slate-200 bg-slate-50 px-5 py-4">
                <p className="item-title">Scenario result</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Predicted price", "—"],
                    ["Price change", "—"],
                    ["Percentage change", "—"],
                  ].map(([label, value]) => (
                    <div key={label} className="border border-slate-200 bg-white p-3">
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className="mt-2 text-lg font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 px-5 py-4">
                <button
                  type="button"
                  onClick={() => setSelectedProperty(null)}
                  className="secondary-button px-4 py-2"
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Run what-if
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </details>
  );
}
