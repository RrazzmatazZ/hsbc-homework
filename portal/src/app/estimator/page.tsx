"use client";

import { type FormEvent, useCallback, useEffect, useState } from "react";

import { PropertyInput } from "@/components/property-input";
import { useErrorWarning } from "@/hooks/use-error-warning";
import { useLoading } from "@/hooks/use-loading";
import { PROPERTY_FIELDS, type PropertyFeatures } from "@/lib/property-fields";
import { savePredictionHistory } from "@/lib/prediction-history";

import { FeatureContributionChart } from "./feature-contribution-chart";
import { HistoryDialog } from "./history-dialog";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type PredictionResult = {
  predictedPrice: number;
  contributions: PropertyFeatures;
};

type ServiceStatus = "Checking" | "Ready" | "Pending" | "Unavailable";

export default function EstimatorPage() {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>("Checking");
  const [historyOpen, setHistoryOpen] = useState(false);
  const { showErrorMsg } = useErrorWarning();
  const { loading, runWithLoading } = useLoading();
  const closeHistory = useCallback(() => setHistoryOpen(false), []);

  useEffect(() => {
    const controller = new AbortController();

    async function checkService() {
      try {
        const response = await fetch("/api/predict/health", {
          cache: "no-store",
          signal: controller.signal,
        });
        const result = (await response.json()) as { status?: string };

        if (result.status === "ready") setServiceStatus("Ready");
        else if (result.status === "pending") setServiceStatus("Pending");
        else setServiceStatus("Unavailable");
      } catch {
        if (!controller.signal.aborted) setServiceStatus("Unavailable");
      }
    }

    void checkService();
    return () => controller.abort();
  }, []);

  async function submitPrediction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const features = Object.fromEntries(
      PROPERTY_FIELDS.map((field) => [field.name, Number(formData.get(field.name))]),
    ) as PropertyFeatures;

    try {
      const result = await runWithLoading(async () => {
        const response = await fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ features }),
        });

        if (!response.ok) throw new Error();
        return (await response.json()) as PredictionResult;
      });

      setPrediction(result);
      setServiceStatus("Ready");
      savePredictionHistory(
        features,
        result.predictedPrice,
        result.contributions,
      );
    } catch {
      setServiceStatus("Unavailable");
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
                  containerClassName={`border border-slate-200 p-3 ${index === PROPERTY_FIELDS.length - 1 ? "sm:col-span-2" : ""
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
            <h2 id="estimate-result-heading" className="section-title">
              Estimated property value
            </h2>

            <p className="mt-8 text-3xl font-semibold">
              {prediction === null ? "—" : priceFormatter.format(prediction.predictedPrice)}
            </p>

            <section className="mt-8 border-t border-slate-200 pt-5" aria-labelledby="feature-contribution-heading">
              <h2 id="feature-contribution-heading" className="section-title">
                Feature contribution
              </h2>

              <div className="mt-4">
                {
                  prediction?.contributions && (
                    <FeatureContributionChart contributions={prediction.contributions} />
                  )
                }
              </div>
            </section>

            <div className="mt-8 space-y-3 border-t border-slate-200 pt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Service status</span>
                <span className="font-medium text-slate-700">
                  {loading ? "Predicting" : serviceStatus}
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
