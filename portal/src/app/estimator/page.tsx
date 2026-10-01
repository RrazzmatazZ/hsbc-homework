"use client";

import { type FormEvent, useCallback, useState } from "react";

import { PropertyInput } from "@/components/property-input";
import { useErrorWarning } from "@/hooks/use-error-warning";
import { useLoading } from "@/hooks/use-loading";
import { PROPERTY_FIELDS, type PropertyFeatures } from "@/lib/property-fields";
import { savePredictionHistory } from "@/lib/prediction-history";

import { HistoryDialog } from "./history-dialog";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function EstimatorPage() {
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [requestFailed, setRequestFailed] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const { showErrorMsg } = useErrorWarning();
  const { loading, runWithLoading } = useLoading();
  const closeHistory = useCallback(() => setHistoryOpen(false), []);

  async function submitPrediction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const features = Object.fromEntries(
      PROPERTY_FIELDS.map((field) => [field.name, Number(formData.get(field.name))]),
    ) as PropertyFeatures;

    setRequestFailed(false);

    try {
      const result = await runWithLoading(async () => {
        const response = await fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ features }),
        });

        if (!response.ok) throw new Error();
        return (await response.json()) as { predictedPrice: number };
      });

      setPredictedPrice(result.predictedPrice);
      savePredictionHistory(features, result.predictedPrice);
    } catch {
      setRequestFailed(true);
      showErrorMsg("Unable to estimate the property value.");
    }
  }

  return (
    <div className="page-shell">
      <main className="page-container">
        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <form
            className="card p-5 sm:p-6"
            aria-labelledby="property-details-heading"
            onSubmit={submitPrediction}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 id="property-details-heading" className="section-title">Property details</h2>
              <button
                type="button"
                className="secondary-button px-3 py-1.5"
                onClick={() => setHistoryOpen(true)}
              >
                History
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {PROPERTY_FIELDS.map((field, index) => (
                <PropertyInput
                  key={field.name}
                  {...field}
                  containerClassName={`border border-slate-200 p-3 ${
                    index === PROPERTY_FIELDS.length - 1 ? "sm:col-span-2" : ""
                  }`}
                />
              ))}
            </div>

            <div className="mt-5 flex justify-end border-t border-slate-200 pt-5">
              <button
                type="submit"
                disabled={loading}
                className="primary-button disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? "Estimating…" : "Estimate value"}
              </button>
            </div>
          </form>

          <aside className="card p-5 sm:p-6" aria-labelledby="estimate-result-heading">
            <h2 id="estimate-result-heading" className="section-title">Estimated property value</h2>

            <p className="mt-8 text-3xl font-semibold">
              {predictedPrice === null ? "—" : priceFormatter.format(predictedPrice)}
            </p>

            <section className="mt-8 border-t border-slate-200 pt-5" aria-labelledby="feature-contribution-heading">
              <h3 id="feature-contribution-heading" className="item-title">
                Feature contribution
              </h3>
              <p className="supporting-text">
                How each property feature affects the predicted price.
              </p>
              <div className="relative mt-4 flex h-44 items-center justify-center border border-dashed border-slate-200 bg-slate-50">
                <span
                  aria-hidden="true"
                  className="absolute bottom-9 left-1/2 top-4 border-l border-dashed border-slate-300"
                />
                <p className="relative z-10 bg-slate-50 px-3 text-center text-sm text-slate-500">
                  Contribution data will appear here.
                </p>
                <span className="absolute bottom-3 left-4 text-xs text-slate-400">
                  Negative impact
                </span>
                <span className="absolute bottom-3 right-4 text-xs text-slate-400">
                  Positive impact
                </span>
              </div>
            </section>

            <div className="mt-8 space-y-3 border-t border-slate-200 pt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Service status</span>
                <span className="font-medium text-slate-700">
                  {loading ? "Predicting" : requestFailed ? "Unavailable" : "Ready"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">History</span>
                <span className="font-medium text-slate-700">
                  {predictedPrice === null ? "No prediction yet" : "Saved in this browser"}
                </span>
              </div>
            </div>
          </aside>
        </div>

        {historyOpen ? <HistoryDialog onClose={closeHistory} /> : null}
      </main>
    </div>
  );
}
