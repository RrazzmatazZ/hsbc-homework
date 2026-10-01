"use client";

import { useEffect, useState } from "react";

import { PropertyTable, type PropertyTableRow } from "@/components/property-table";
import {
  clearPredictionHistory,
  readPredictionHistory,
  type PredictionHistoryEntry,
} from "@/lib/prediction-history";

type HistoryDialogProps = {
  onClose: () => void;
};

type HistoryTableRow = PropertyTableRow & {
  createdAt: string;
};

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
  const [history, setHistory] = useState<PredictionHistoryEntry[]>(readPredictionHistory);
  const [page, setPage] = useState(0);
  const totalPages = Math.max(Math.ceil(history.length / PAGE_SIZE), 1);
  const pageData = history
    .slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
    .map(toTableRow);

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
        className="max-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-y-auto border border-slate-300 bg-white shadow-lg"
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 id="prediction-history-title" className="section-title">Prediction history</h2>
            <p className="supporting-text">Saved in this browser only.</p>
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

        <PropertyTable
          data={pageData}
          page={page}
          totalElements={history.length}
          totalPages={totalPages}
          onPageRequest={setPage}
          firstColumnLabel="Date"
          renderFirstColumn={(entry) => (
            <time dateTime={entry.createdAt}>
              {dateFormatter.format(new Date(entry.createdAt))}
            </time>
          )}
          priceColumnLabel="Predicted price"
          emptyMessage="No prediction history yet."
        />

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
          {history.length > 0 ? (
            <button
              type="button"
              className="secondary-button px-4 py-2 text-red-700"
              onClick={() => {
                clearPredictionHistory();
                setHistory([]);
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
    </div>
  );
}
