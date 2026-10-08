"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("Unexpected error:", error);
  }, [error]);

  return (
    <main className="page-container flex flex-1 flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-semibold text-slate-950">
        Something went wrong
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        We could not load this page. Please try again.
      </p>
      {error.digest ? (
        <p className="mt-2 text-xs text-slate-400">
          Error reference: {error.digest}
        </p>
      ) : null}
      <button type="button" className="primary-button mt-6" onClick={retry}>
        Try again
      </button>
    </main>
  );
}
