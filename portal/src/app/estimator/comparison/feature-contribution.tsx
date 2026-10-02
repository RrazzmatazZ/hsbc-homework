"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";

import { PROPERTY_FIELDS } from "@/lib/property-fields";
import type { PredictionHistoryEntry } from "@/lib/prediction-history";

type FeatureContributionProps = {
  entries: PredictionHistoryEntry[];
};

const CHART_HEIGHT = 340;
const CHART_TOP = 50;
const CHART_BOTTOM = 14;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatContribution(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}$${Math.abs(value / 1000).toFixed(1)}k`;
}

export function FeatureContribution({ entries }: FeatureContributionProps) {
  const chartElementRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const hasContributionData =
    entries.length > 0 && entries.every((entry) => entry.contributions);

  useEffect(() => {
    if (!chartElementRef.current) return;

    const chart = echarts.init(chartElementRef.current);
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(chartElementRef.current);
    chartRef.current = chart;

    return () => {
      observer.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !hasContributionData) return;

    const propertyCount = entries.length;
    const gridStart = 2;
    const availableWidth = 96;
    const columnWidth = availableWidth / propertyCount;
    const grids = entries.map((_, index) => ({
      left: `${gridStart + index * columnWidth}%`,
      top: CHART_TOP,
      width: `${columnWidth - 3}%`,
      bottom: CHART_BOTTOM,
    }));
    const featureLabels = PROPERTY_FIELDS.map((field) => field.label);
    const maximumContribution = Math.max(
      ...entries.flatMap((entry) =>
        PROPERTY_FIELDS.map((field) => Math.abs(entry.contributions?.[field.name] ?? 0)),
      ),
    );
    const axisLimit = Math.max(20000, Math.ceil(maximumContribution / 20000) * 20000);

    chart.setOption(
      {
        animationDuration: 350,
        tooltip: {
          trigger: "item",
          formatter: (params: { seriesName: string; name: string; value: number }) =>
            `<strong>${params.seriesName}</strong><br>${params.name}: ${formatContribution(params.value)}`,
        },
        title: entries.map((entry, index) => ({
          text: `Property ${index + 1}`,
          subtext: currencyFormatter.format(entry.predictedPrice),
          left: `${gridStart + index * columnWidth + (columnWidth - 3) / 2}%`,
          top: 4,
          textAlign: "center",
          textStyle: { color: "#0f172a", fontSize: 13, fontWeight: 600 },
          subtextStyle: { color: "#475569", fontSize: 12, fontWeight: 500 },
        })),
        grid: grids,
        xAxis: grids.map((_, index) => ({
          type: "value",
          gridIndex: index,
          min: -axisLimit,
          max: axisLimit,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: "#eef2f6" } },
        })),
        yAxis: grids.map((_, index) => ({
          type: "category",
          gridIndex: index,
          inverse: true,
          data: featureLabels,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
        })),
        series: entries.map((entry, index) => ({
          name: `Property ${index + 1}`,
          type: "bar",
          xAxisIndex: index,
          yAxisIndex: index,
          barWidth: 16,
          data: PROPERTY_FIELDS.map((field) => {
            const value = entry.contributions?.[field.name] ?? 0;
            return {
              value,
              label: { position: "right", color: "#475569" },
            };
          }),
          itemStyle: {
            color: (params: { value: number }) =>
              params.value >= 0 ? "#334155" : "#94a3b8",
          },
          label: {
            show: true,
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
        })),
      },
      true,
    );
  }, [entries, hasContributionData]);

  return (
    <section className="flex h-full min-w-0 flex-col border border-slate-200 bg-white" aria-labelledby="contribution-comparison-title">
      <div className="h-20 shrink-0 border-b border-slate-200 px-4 py-3">
        <h3 id="contribution-comparison-title" className="section-title">
          Feature contribution
        </h3>
      </div>

      {hasContributionData ? (
        <div className="min-h-0 w-full max-w-full flex-1 overflow-x-auto overscroll-x-contain">
          <div
            className="flex h-full"
            style={{
              width: entries.length > 2 ? 160 + entries.length * 240 : "100%",
              minWidth: 620,
              minHeight: CHART_HEIGHT,
            }}
          >
            <div
              className="sticky left-0 z-10 grid w-40 shrink-0 border-r border-slate-200 bg-white"
              style={{
                height: "100%",
                minHeight: CHART_HEIGHT,
                paddingTop: CHART_TOP,
                paddingBottom: CHART_BOTTOM,
                gridTemplateRows: `repeat(${PROPERTY_FIELDS.length}, minmax(0, 1fr))`,
              }}
            >
              {PROPERTY_FIELDS.map((field) => (
                <div
                  key={field.name}
                  className="flex items-center justify-end px-4 text-right text-xs text-slate-600"
                >
                  {field.label}
                </div>
              ))}
            </div>
            <div
              ref={chartElementRef}
              className="min-w-0 flex-1"
              style={{ height: "100%", minHeight: CHART_HEIGHT }}
              role="img"
              aria-label="Feature contribution comparison for selected predictions"
            />
          </div>
        </div>
      ) : (
        <p className="px-5 py-10 text-center text-sm text-slate-500">
          Contribution data is unavailable for the selected predictions.
        </p>
      )}

    </section>
  );
}
