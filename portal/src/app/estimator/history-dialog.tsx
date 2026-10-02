"use client";

import { useEffect, useState } from "react";

import { PropertyTable, type PropertyTableRow } from "@/components/property-table";
import {
  clearPredictionHistory,
  readPredictionHistory,
  type PredictionHistoryEntry,
} from "@/lib/prediction-history";

import { FeatureContribution } from "./comparison/feature-contribution";
import { FeaturePrice } from "./comparison/feature-price";

type HistoryDialogProps = {
  onClose: () => void;
};

type HistoryTableRow = PropertyTableRow & {
  createdAt: string;
};

type DialogView = "history" | "comparison";

const PAGE_SIZE = 5;
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

function toTableRow(entry: PredictionHistoryEntry): HistoryTableRow {
  return {
    id: entry.id,
    price: entry.predictedPrice,
    createdAt: entry.createdAt,
    ...entry.features,
  };
}

export function HistoryDialog({ onClose }: HistoryDialogProps) {
  const [history, setHistory] = useState(readPredictionHistory);
  const [page, setPage] = useState(0);
  const [view, setView] = useState<DialogView>("history");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const totalPages = Math.max(Math.ceil(history.length / PAGE_SIZE), 1);
  const pageData = history
    .slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
    .map(toTableRow);
  const selectedEntries = selectedIds
    .map((id) => history.find((entry) => entry.id === id))
    .filter((entry): entry is PredictionHistoryEntry => Boolean(entry));

  function toggleSelection(id: string) {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((selectedId) => selectedId !== id);
      return [...current, id];
    });
  }

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="prediction-history-title"
        className="max-h-[calc(100vh-2rem)] w-full max-w-[1400px] overflow-x-hidden overflow-y-auto border border-slate-300 bg-white shadow-lg"
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-start gap-4">
            {view === "comparison" ? (
              <button
                type="button"
                onClick={() => setView("history")}
                className="secondary-button mt-0.5 px-3 py-1.5"
              >
                ← Back to history
              </button>
            ) : null}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="prediction-history-title" className="section-title">
                  {view === "history" ? "Prediction history" : "Prediction comparison"}
                </h2>
              </div>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close prediction history"
            onClick={onClose}
            className="ml-4 px-2 py-1 text-xl leading-none text-slate-500 hover:text-slate-950"
          >
            ×
          </button>
        </div>

        {view === "history" ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-3">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {selectedIds.length} records selected
                </p>
              </div>
              <button
                type="button"
                disabled={selectedEntries.length < 2}
                onClick={() => setView("comparison")}
                className="primary-button disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Compare selected
              </button>
            </div>

            <PropertyTable
              data={pageData}
              page={page}
              totalElements={history.length}
              totalPages={totalPages}
              onPageRequest={setPage}
              firstColumnLabel="Compare / Date"
              renderFirstColumn={(entry) => {
                const id = String(entry.id);
                const selected = selectedIds.includes(id);

                return (
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleSelection(id)}
                      className="h-4 w-4 accent-slate-900"
                      aria-label={`Compare prediction from ${dateFormatter.format(new Date(entry.createdAt))}`}
                    />
                    <time dateTime={entry.createdAt}>
                      {dateFormatter.format(new Date(entry.createdAt))}
                    </time>
                  </label>
                );
              }}
              priceColumnLabel="Predicted price"
              emptyMessage="No prediction history yet."
            />

            <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
              <div className="flex gap-2">
                {history.length > 0 ? (
                  <button
                    type="button"
                    className="secondary-button px-4 py-2 text-red-700"
                    onClick={() => {
                      clearPredictionHistory();
                      setHistory([]);
                      setSelectedIds([]);
                      setPage(0);
                    }}
                  >
                    Clear history
                  </button>
                ) : null}
                <button type="button" className="secondary-button px-4 py-2" onClick={onClose}>
                  Close
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="min-w-0 bg-slate-50 p-3">
            <div className="grid min-w-0 items-stretch gap-3 lg:grid-cols-2">
              <FeatureContribution entries={selectedEntries} />
              <FeaturePrice entries={selectedEntries} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
