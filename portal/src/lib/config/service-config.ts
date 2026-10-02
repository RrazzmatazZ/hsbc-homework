import "server-only";

export const PREDICTION_SERVICE_URL =
    process.env.PREDICTION_SERVICE_URL ??
    "http://localhost:8000";

export const ANALYSIS_SERVICE_URL =
    process.env.ANALYSIS_SERVICE_URL ??
    "http://localhost:8080";