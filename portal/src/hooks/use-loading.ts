"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function delay(duration: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, duration));
}

export function useLoading(minimumDuration = 500, initiallyLoading = false) {
  const [loading, setLoading] = useState(initiallyLoading);
  const activeRequests = useRef(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const runWithLoading = useCallback(async <T,>(request: () => Promise<T>) => {
    activeRequests.current += 1;
    const startedAt = Date.now();

    if (mounted.current) setLoading(true);

    try {
      return await request();
    } finally {
      const remainingTime = minimumDuration - (Date.now() - startedAt);
      if (remainingTime > 0) await delay(remainingTime);

      activeRequests.current -= 1;
      if (mounted.current && activeRequests.current === 0) setLoading(false);
    }
  }, [minimumDuration]);

  return { loading, runWithLoading };
}
