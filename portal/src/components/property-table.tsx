"use client";

import type { ReactNode } from "react";

import type { PropertyFeatures } from "@/lib/property-fields";

export type PropertyTableRow = PropertyFeatures & {
  id: string | number;
  price: number;
};

export type PropertySortField = keyof PropertyTableRow;
type SortDirection = "asc" | "desc";

type PropertyTableSort = {
  field: PropertySortField;
  direction: SortDirection;
  onChange: (field: PropertySortField) => void;
};

type PropertyTableProps<T extends PropertyTableRow> = {
  data: T[];
  page: number;
  totalElements: number;
  totalPages: number;
  onPageRequest: (page: number) => void;
  firstColumnLabel: string;
  renderFirstColumn: (row: T) => ReactNode;
  firstColumnSortField?: PropertySortField;
  priceColumnLabel?: string;
  sort?: PropertyTableSort;
  loading?: boolean;
  emptyMessage?: string;
  minHeightClassName?: string;
  rowAction?: {
    label: string;
    onClick: (row: T) => void;
  };
};

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type TableHeaderProps = {
  label: string;
  field?: PropertySortField;
  sort?: PropertyTableSort;
};

function TableHeader({ label, field, sort }: TableHeaderProps) {
  if (!field || !sort) return <th>{label}</th>;

  const active = sort.field === field;
  const direction = active ? sort.direction : undefined;

  return (
    <th aria-sort={direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none"}>
      <button
        type="button"
        onClick={() => sort.onChange(field)}
        className="flex w-full items-center gap-1.5 text-left"
        aria-label={`Sort by ${label}${active ? `, currently ${direction}ending` : ""}`}
      >
        <span>{label}</span>
        <span aria-hidden="true" className={active ? "text-slate-900" : "text-slate-300"}>
          {direction === "asc" ? "↑" : direction === "desc" ? "↓" : "↕"}
        </span>
      </button>
    </th>
  );
}

export function PropertyTable<T extends PropertyTableRow>({
  data,
  page,
  totalElements,
  totalPages,
  onPageRequest,
  firstColumnLabel,
  renderFirstColumn,
  firstColumnSortField,
  priceColumnLabel = "Price",
  sort,
  loading = false,
  emptyMessage = "No property data.",
  minHeightClassName = "",
  rowAction,
}: PropertyTableProps<T>) {
  const pageCount = Math.max(totalPages, 1);

  return (
    <div>
      <div
        className={`relative overflow-x-auto ${minHeightClassName}`}
        aria-busy={loading}
      >
        <table className="property-table min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              <TableHeader label={firstColumnLabel} field={firstColumnSortField} sort={sort} />
              <TableHeader label={priceColumnLabel} field="price" sort={sort} />
              <TableHeader label="Area (sq ft)" field="squareFootage" sort={sort} />
              <TableHeader label="Beds" field="bedrooms" sort={sort} />
              <TableHeader label="Baths" field="bathrooms" sort={sort} />
              <TableHeader label="Year built" field="yearBuilt" sort={sort} />
              <TableHeader label="Lot size (sq ft)" field="lotSize" sort={sort} />
              <TableHeader label="City distance (miles)" field="distanceToCityCenter" sort={sort} />
              <TableHeader label="School rating" field="schoolRating" sort={sort} />
              {rowAction ? <th className="text-right">Action</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.map((property) => (
              <tr key={property.id}>
                <td>{renderFirstColumn(property)}</td>
                <td>{priceFormatter.format(property.price)}</td>
                <td>{property.squareFootage}</td>
                <td>{property.bedrooms}</td>
                <td>{property.bathrooms}</td>
                <td>{property.yearBuilt}</td>
                <td>{property.lotSize}</td>
                <td>{property.distanceToCityCenter}</td>
                <td>{property.schoolRating}</td>
                {rowAction ? (
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={() => rowAction.onClick(property)}
                      className="secondary-button px-3 py-1.5 text-slate-700"
                    >
                      {rowAction.label}
                    </button>
                  </td>
                ) : null}
              </tr>
            ))}
            {!loading && data.length === 0 ? (
              <tr>
                <td colSpan={rowAction ? 10 : 9} className="py-10 text-center text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>

        {loading ? (
          <div
            role="status"
            aria-live="polite"
            className="absolute inset-0 z-10 flex min-h-40 items-center justify-center bg-white/75"
          >
            <div className="flex items-center gap-3 border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <span
                className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800"
                aria-hidden="true"
              />
              <span className="text-sm text-slate-700">Loading…</span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex min-h-17 items-center justify-between border-t border-slate-200 px-4 py-4">
        <span className="text-sm text-slate-500">
          {totalElements} records · Page {page + 1} of {pageCount}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={loading || page === 0}
            onClick={() => onPageRequest(page - 1)}
            className="pagination-button"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={loading || page + 1 >= pageCount}
            onClick={() => onPageRequest(page + 1)}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
