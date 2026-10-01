"use client";

import { createContext, useContext } from "react";

type ErrorWarningContextValue = {
  showErrorMsg: (message: string, title?: string) => void;
};

export const ErrorWarningContext = createContext<ErrorWarningContextValue | null>(null);

export function useErrorWarning() {
  const context = useContext(ErrorWarningContext);

  if (!context) {
    throw new Error("useErrorWarning must be used within ErrorProvider.");
  }

  return context;
}
