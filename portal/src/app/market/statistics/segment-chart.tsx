"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";

export type SegmentBucket = {
  from: number;
  to: number;
  count: number;
};

type SegmentChartProps = {
  title: string;
  buckets: SegmentBucket[];
  formatValue: (value: number) => string;
};

export function SegmentChart({ title, buckets, formatValue }: SegmentChartProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current || buckets.length === 0) return;

    const chart = echarts.init(elementRef.current);
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(elementRef.current);

    chart.setOption({
      animationDuration: 250,
      tooltip: { trigger: "axis" },
      grid: { left: 44, right: 16, top: 20, bottom: 62 },
      xAxis: {
        type: "category",
        data: buckets.map((bucket) => `${formatValue(bucket.from)}–${formatValue(bucket.to)}`),
        axisLabel: { color: "#64748b", fontSize: 10, rotate: 20 },
        axisLine: { lineStyle: { color: "#cbd5e1" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        minInterval: 1,
        axisLabel: { color: "#64748b" },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: "#eef2f6" } },
      },
      series: [{ type: "bar", data: buckets.map((bucket) => bucket.count), itemStyle: { color: "#334155" } }],
    });

    return () => {
      observer.disconnect();
      chart.dispose();
    };
  }, [buckets, formatValue]);

  return (
    <article className="min-w-0 border border-slate-200 bg-white">
      <h3 className="item-title border-b border-slate-200 px-4 py-3">{title}</h3>
      {buckets.length === 0 ? (
        <p className="flex h-64 items-center justify-center text-sm text-slate-500">No data</p>
      ) : (
        <div ref={elementRef} className="h-64 w-full" role="img" aria-label={title} />
      )}
    </article>
  );
}
