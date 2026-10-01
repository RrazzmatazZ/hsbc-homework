import type { PropertyFeatures } from "@/lib/property-fields";

export type PredictionHistoryEntry = {
  id: string;
  createdAt: string;
  features: PropertyFeatures;
  predictedPrice: number;
};

const STORAGE_KEY = "property-prediction-history";
const MAX_HISTORY_ITEMS = 20;

export function readPredictionHistory(): PredictionHistoryEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const savedHistory = window.localStorage.getItem(STORAGE_KEY);
    if (!savedHistory) return [];

    const parsedHistory = JSON.parse(savedHistory) as unknown;
    return Array.isArray(parsedHistory) ? parsedHistory : [];
  } catch {
    return [];
  }
}

export function savePredictionHistory(
  features: PropertyFeatures,
  predictedPrice: number,
) {
  if (typeof window === "undefined") return;

  try {
    const entry: PredictionHistoryEntry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      features,
      predictedPrice,
    };
    const history = [entry, ...readPredictionHistory()].slice(0, MAX_HISTORY_ITEMS);

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Prediction results still work when browser storage is unavailable.
  }
}

export function clearPredictionHistory() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // The dialog can still close when browser storage is unavailable.
  }
}
