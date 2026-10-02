"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

import {
  PROPERTY_FIELDS,
  type PropertyFieldName,
} from "@/lib/property-fields";
import type { PredictionHistoryEntry } from "@/lib/prediction-history";

type FeaturePriceProps = {
  entries: PredictionHistoryEntry[];
};

type FeatureConfig = {
  unit: string;
  axisMinimum: number;
  format: (value: number) => string;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const featureConfig: Record<PropertyFieldName, FeatureConfig> = {
  squareFootage: {
    unit: "sq ft",
    axisMinimum: 0,
    format: (value) => value.toLocaleString("en-US"),
  },
  bedrooms: { unit: "", axisMinimum: 0, format: String },
  bathrooms: { unit: "", axisMinimum: 0, format: String },
  yearBuilt: { unit: "", axisMinimum: 1900, format: String },
  lotSize: {
    unit: "sq ft",
    axisMinimum: 0,
    format: (value) => value.toLocaleString("en-US"),
  },
  distanceToCityCenter: { unit: "miles", axisMinimum: 0, format: String },
  schoolRating: { unit: "/ 10", axisMinimum: 0, format: String },
};

export function FeaturePrice({ entries }: FeaturePriceProps) {
  const [feature, setFeature] = useState<PropertyFieldName>("squareFootage");
  const chartElementRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

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
    if (!chart || entries.length === 0) return;

    const definition = PROPERTY_FIELDS.find((field) => field.name === feature);
    const config = featureConfig[feature];
    const propertyNames = entries.map((_, index) => `Property ${index + 1}`);
    const featureValues = entries.map((entry) => entry.features[feature]);
    const priceValues = entries.map((entry) => entry.predictedPrice);
    const featureMaximum = Math.max(...featureValues);
    const featurePadding = feature === "yearBuilt" ? 20 : Math.max(featureMaximum * 0.2, 1);
    const priceMaximum = Math.max(...priceValues);

    chart.setOption(
      {
        animationDuration: 350,
        animationDurationUpdate: 300,
        title: [
          {
            text: definition?.label ?? feature,
            left: "28%",
            top: 14,
            textAlign: "center",
            textStyle: { color: "#334155", fontSize: 13, fontWeight: 600 },
          },
          {
            text: "Predicted price",
            left: "76%",
            top: 14,
            textAlign: "center",
            textStyle: { color: "#334155", fontSize: 13, fontWeight: 600 },
          },
        ],
        grid: [
          { left: 112, top: 58, width: "35%", bottom: 58 },
          { left: "58%", top: 58, right: 48, bottom: 58 },
        ],
        tooltip: {
          trigger: "item",
          formatter: (params: { seriesName: string; name: string; value: number }) => {
            const formattedValue =
              params.seriesName === "Predicted price"
                ? currencyFormatter.format(params.value)
                : `${config.format(params.value)}${config.unit ? ` ${config.unit}` : ""}`;
            return `<strong>${params.name}</strong><br>${params.seriesName}: ${formattedValue}`;
          },
        },
        xAxis: [
          {
            type: "value",
            gridIndex: 0,
            min: config.axisMinimum,
            max: featureMaximum + featurePadding,
            splitNumber: 3,
            name: config.unit,
            nameLocation: "middle",
            nameGap: 36,
            axisLabel: { color: "#64748b", fontSize: 10, formatter: config.format },
            splitLine: { lineStyle: { color: "#eef2f6" } },
            axisLine: { show: false },
            axisTick: { show: false },
          },
          {
            type: "value",
            gridIndex: 1,
            min: 0,
            max: priceMaximum * 1.22,
            splitNumber: 3,
            name: "USD",
            nameLocation: "middle",
            nameGap: 36,
            axisLabel: {
              color: "#64748b",
              fontSize: 10,
              formatter: (value: number) => `$${Math.round(value / 1000)}k`,
            },
            splitLine: { lineStyle: { color: "#eef2f6" } },
            axisLine: { show: false },
            axisTick: { show: false },
          },
        ],
        yAxis: [
          {
            type: "category",
            gridIndex: 0,
            inverse: true,
            data: propertyNames,
            axisLabel: { color: "#334155", fontWeight: 500 },
            axisLine: { show: false },
            axisTick: { show: false },
          },
          {
            type: "category",
            gridIndex: 1,
            inverse: true,
            data: propertyNames,
            axisLabel: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
          },
        ],
        series: [
          {
            name: definition?.label ?? feature,
            type: "bar",
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: featureValues,
            barWidth: 24,
            itemStyle: { color: "#334155" },
            label: {
              show: true,
              position: "right",
              color: "#334155",
              formatter: (params: { value: number }) =>
                `${config.format(params.value)}${config.unit ? ` ${config.unit}` : ""}`,
            },
          },
          {
            name: "Predicted price",
            type: "bar",
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: priceValues,
            barWidth: 24,
            itemStyle: { color: "#db0011" },
            label: {
              show: true,
              position: "right",
              color: "#991b1b",
              fontWeight: 600,
              formatter: (params: { value: number }) => currencyFormatter.format(params.value),
            },
          },
        ],
      },
      true,
    );
  }, [entries, feature]);

  return (
    <section className="flex h-full min-w-0 flex-col border border-slate-200 bg-white" aria-labelledby="feature-price-title">
      <div className="flex h-20 shrink-0 flex-wrap items-start justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <div>
          <h3 id="feature-price-title" className="section-title">Feature–price comparison</h3>
        </div>
        <label className="grid gap-1 text-xs text-slate-500">
          <select
            value={feature}
            onChange={(event) => setFeature(event.target.value as PropertyFieldName)}
            className="form-control min-w-48 bg-white text-slate-900"
          >
            {PROPERTY_FIELDS.map((field) => (
              <option key={field.name} value={field.name}>{field.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="min-h-0 w-full max-w-full flex-1 overflow-x-auto overscroll-x-contain">
        <div className="h-full min-w-155 px-2">
          <div
            ref={chartElementRef}
            className="w-full"
            style={{ height: Math.max(330, entries.length * 44 + 110) }}
            role="img"
            aria-label="Paired feature and predicted price bars for selected predictions"
          />
        </div>
      </div>
    </section>
  );
}
