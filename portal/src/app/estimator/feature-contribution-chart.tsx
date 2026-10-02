"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";

import { PROPERTY_FIELDS, type PropertyFeatures } from "@/lib/property-fields";

function formatContribution(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}$${Math.abs(value / 1000).toFixed(1)}k`;
}

export function FeatureContributionChart({
  contributions,
}: {
  contributions: PropertyFeatures;
}) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current || !contributions) return;

    const chart = echarts.init(elementRef.current);
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(elementRef.current);

    const values = PROPERTY_FIELDS.map((field) => contributions[field.name]);

    chart.setOption({
      animationDuration: 300,
      grid: { left: 118, right: 62, top: 12, bottom: 20 },
      tooltip: {
        trigger: "item",
        formatter: (params: { name: string; value: number }) =>
          `${params.name}: ${formatContribution(params.value)}`,
      },
      xAxis: {
        type: "value",
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: "#eef2f6" } },
      },
      yAxis: {
        type: "category",
        inverse: true,
        data: PROPERTY_FIELDS.map((field) => field.label),
        axisLabel: { color: "#475569", fontSize: 11 },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          type: "bar",
          barWidth: 16,
          data: values.map((value) => ({
            value,
            itemStyle: { color: value >= 0 ? "#334155" : "#94a3b8" },
            label: { position: "right" },
          })),
          label: {
            show: true,
            color: "#475569",
            fontSize: 10,
            formatter: (params: { value: number }) => formatContribution(params.value),
          },
          markLine: {
            silent: true,
            symbol: "none",
            label: { show: false },
            lineStyle: { color: "#94a3b8" },
            data: [{ xAxis: 0 }],
          },
        },
      ],
    });

    return () => {
      observer.disconnect();
      chart.dispose();
    };
  }, [contributions]);

  return (
    <div
      ref={elementRef}
      className="h-56 w-full"
      role="img"
      aria-label="Feature contribution to predicted price"
    />
  );
}
