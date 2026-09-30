"use client";

import { useEffect, useState } from "react";

type Property = {
  id: number;
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  lotSize: number;
  distanceToCityCenter: number;
  schoolRating: number;
  price: number;
};

type PropertyPage = {
  content: Property[];
  page: number;
  totalElements: number;
  totalPages: number;
};

const PAGE_SIZE = 10;
const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function PropertyTable() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PropertyPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch("/api/properties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page,
            size: PAGE_SIZE,
            sortBy: "id",
            isASC: true,
          }),
          signal: controller.signal,
        });

        if (!response.ok) throw new Error();
        setData((await response.json()) as PropertyPage);
      } catch {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void load();
    return () => controller.abort();
  }, [page]);

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
        {error ? (
          <p role="alert" className="border-b border-slate-200 px-4 py-3 text-sm text-red-700">
            Unable to load property data.
          </p>
        ) : null}

        <div className="min-h-130 overflow-x-auto">
          <table className={`property-table min-w-full text-left text-sm ${loading && data ? "opacity-60" : ""}`}>
            <thead className="bg-slate-50 text-xs uppercase text-slate-600">
              <tr>
                <th>ID</th>
                <th>Price</th>
                <th>Square ft</th>
                <th>Beds</th>
                <th>Baths</th>
                <th>Year built</th>
                <th>Lot size</th>
                <th>City distance</th>
                <th>School rating</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data?.content.map((property) => (
                <tr key={property.id}>
                  <td>{property.id}</td>
                  <td>{priceFormatter.format(property.price)}</td>
                  <td>{property.squareFootage}</td>
                  <td>{property.bedrooms}</td>
                  <td>{property.bathrooms}</td>
                  <td>{property.yearBuilt}</td>
                  <td>{property.lotSize}</td>
                  <td>{property.distanceToCityCenter}</td>
                  <td>{property.schoolRating}</td>
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedProperty(property)}
                      className="secondary-button px-3 py-1.5 text-slate-700"
                    >
                      What-if
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex min-h-17 items-center justify-between border-t border-slate-200 px-4 py-4">
          <span className="text-sm text-slate-500">
            Page {data ? data.page + 1 : 1} of {data?.totalPages ?? 1}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={loading || page === 0}
              onClick={() => setPage((current) => current - 1)}
              className="pagination-button"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={loading || !data || page + 1 >= data.totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </div>
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
              <div>
                <h2 id="what-if-title" className="section-title">What-if analysis</h2>
              </div>
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
                <label>
                  <span className="item-title form-label">Square footage</span>
                  <input
                    name="squareFootage"
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={selectedProperty.squareFootage}
                    className="form-control"
                  />
                </label>
                <label>
                  <span className="item-title form-label">Bedrooms</span>
                  <input
                    name="bedrooms"
                    type="number"
                    min="0"
                    step="1"
                    defaultValue={selectedProperty.bedrooms}
                    className="form-control"
                  />
                </label>
                <label>
                  <span className="item-title form-label">Bathrooms</span>
                  <input
                    name="bathrooms"
                    type="number"
                    min="0"
                    step="0.5"
                    defaultValue={selectedProperty.bathrooms}
                    className="form-control"
                  />
                </label>
                <label>
                  <span className="item-title form-label">Year built</span>
                  <input
                    name="yearBuilt"
                    type="number"
                    min="1800"
                    step="1"
                    defaultValue={selectedProperty.yearBuilt}
                    className="form-control"
                  />
                </label>
                <label>
                  <span className="item-title form-label">Lot size</span>
                  <input
                    name="lotSize"
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={selectedProperty.lotSize}
                    className="form-control"
                  />
                </label>
                <label>
                  <span className="item-title form-label">Distance to city center</span>
                  <input
                    name="distanceToCityCenter"
                    type="number"
                    min="0"
                    step="0.1"
                    defaultValue={selectedProperty.distanceToCityCenter}
                    className="form-control"
                  />
                </label>
                <label className="sm:col-span-2">
                  <span className="item-title form-label">School rating</span>
                  <input
                    name="schoolRating"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    defaultValue={selectedProperty.schoolRating}
                    className="form-control sm:max-w-[calc(50%-0.5rem)]"
                  />
                </label>
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
