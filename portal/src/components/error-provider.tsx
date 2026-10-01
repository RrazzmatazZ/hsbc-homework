"use client";

import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { ErrorWarningContext } from "@/hooks/use-error-warning";

type ErrorMessage = {
  title: string;
  message: string;
};

export function ErrorProvider({ children }: PropsWithChildren) {
  const [error, setError] = useState<ErrorMessage | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const hideError = useCallback(() => {
    setError(null);
    window.requestAnimationFrame(() => previousFocusRef.current?.focus());
  }, []);

  const showErrorMsg = useCallback((message: string, title = "Something went wrong") => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setError({ title, message });
  }, []);

  useEffect(() => {
    if (!error) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") hideError();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [error, hideError]);

  return (
    <ErrorWarningContext.Provider value={{ showErrorMsg }}>
      {children}

      {error ? (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) hideError();
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="error-dialog-title"
            aria-describedby="error-dialog-message"
            className="w-full max-w-md border border-slate-300 bg-white shadow-lg"
          >
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 id="error-dialog-title" className="section-title">{error.title}</h2>
            </div>
            <p id="error-dialog-message" className="px-5 py-5 text-sm text-slate-700">
              {error.message}
            </p>
            <div className="flex justify-end border-t border-slate-200 px-5 py-4">
              <button
                ref={closeButtonRef}
                type="button"
                className="primary-button"
                onClick={hideError}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ErrorWarningContext.Provider>
  );
}
