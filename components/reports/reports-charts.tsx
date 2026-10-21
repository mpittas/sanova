"use client";

import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import { Chart } from "@/components/charts/chart";
import { palette } from "@/lib/tokens";
import styles from "./reports.module.css";

const AXIS = "#718077";
const GRID = "#eef1f0";
const green = palette.primary[500];
const blue = palette.blue[500];
const violet = palette.violet[500];
const amber = palette.amber[500];

const base = (overrides: ApexOptions = {}): ApexOptions => ({
  dataLabels: { enabled: false },
  legend: { show: false },
  states: { hover: { filter: { type: "none" } }, active: { filter: { type: "none" } } },
  grid: { borderColor: GRID, strokeDashArray: 0, xaxis: { lines: { show: false } }, padding: { top: -8, right: 10, bottom: -4, left: 6 } },
  tooltip: { theme: "light", shared: true, intersect: false },
  ...overrides,
  chart: { fontFamily: "inherit", toolbar: { show: false }, zoom: { enabled: false }, parentHeightOffset: 0, animations: { enabled: true, speed: 600 }, ...overrides.chart },
});

const axisLabels = { style: { colors: AXIS, fontSize: "11px" } };
const compact = (value: number) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);

/** Pastel mint deepening to a rich emerald: dark figures on the lighter steps, white on the deepest one. */
export const heatRamp = ["#E8F6EF", "#C8E9D8", "#9FD9BD", "#5DB892", "#23865F"];

/** Visits as a heatmap: one rounded cell per weekday and month, shaded in five steps of the brand green. */
export function VisitsHeatmap({ months, days, matrix }: { months: readonly string[]; days: readonly string[]; matrix: readonly (readonly number[])[] }) {
  const flat = matrix.flat();
  const low = Math.min(...flat);
  const high = Math.max(...flat);
  const step = (high - low) / heatRamp.length;
  const options = useMemo<ApexOptions>(() => base({
    chart: { type: "heatmap", animations: { enabled: true, speed: 260, animateGradually: { enabled: true, delay: 18 }, dynamicAnimation: { enabled: true, speed: 220 } } },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        fontWeight: 500,
        colors: days.map(() => ({ seriesIndex, dataPointIndex }: { seriesIndex: number; dataPointIndex: number }) => (Math.min(Math.floor((matrix.toReversed()[seriesIndex][dataPointIndex] - low) / (step || 1)), heatRamp.length - 1) >= 4 ? "#ffffff" : "#24453a")),
      },
    },
    stroke: { width: 3, colors: ["#fff"] },
    plotOptions: {
      heatmap: {
        radius: 10,
        enableShades: false,
        useFillColorAsStroke: false,
        colorScale: { ranges: heatRamp.map((color, index) => ({ from: index === 0 ? 0 : Math.round(low + step * index), to: index === heatRamp.length - 1 ? high + 1 : Math.round(low + step * (index + 1)) - 1, color })) },
      },
    },
    grid: { padding: { top: -6, right: 6, bottom: -6, left: 8 } },
    xaxis: { type: "category", categories: [...months], position: "bottom", axisBorder: { show: false }, axisTicks: { show: false }, labels: axisLabels, tooltip: { enabled: false } },
    yaxis: { labels: { ...axisLabels, minWidth: 34, offsetX: 0 } },
    tooltip: { theme: "light", shared: false, intersect: true, y: { formatter: (value) => `${value} visits` } },
  }), [months, days, matrix, low, high, step]);
  const series = useMemo(() => days.map((name, index) => ({ name, data: [...matrix[index]] })).toReversed(), [days, matrix]);
  return (
    <div className={styles.heatChart}>
      <Chart type="heatmap" height={250} options={options} series={series} />
    </div>
  );
}

/** Billed against collected, smooth and softly filled. Values are thousands of dollars. */
export function RevenueChart({ categories, billed, collected }: { categories: readonly string[]; billed: readonly number[]; collected: readonly number[] }) {
  const options = useMemo<ApexOptions>(() => base({
    chart: { type: "area", dropShadow: { enabled: true, top: 6, blur: 8, color: green, opacity: 0.14 } },
    colors: [violet, green],
    stroke: { curve: "smooth", width: [2, 2.25], lineCap: "round" },
    fill: { type: "gradient", gradient: { shade: "light", type: "vertical", opacityFrom: 0.38, opacityTo: 0.02, stops: [0, 95, 100] } },
    markers: { size: 0, strokeColors: "#fff", strokeWidth: 3, hover: { size: 6 } },
    xaxis: { categories: [...categories], axisBorder: { show: false }, axisTicks: { show: false }, labels: axisLabels, tooltip: { enabled: false }, crosshairs: { stroke: { color: green, width: 1.5, dashArray: 0 } } },
    yaxis: { tickAmount: 4, labels: { ...axisLabels, minWidth: 34, formatter: (value) => `$${Math.round(value)}K` } },
    tooltip: { theme: "light", shared: true, intersect: false, y: { formatter: (value) => `$${(value ?? 0).toFixed(1)}K` } },
  }), [categories]);
  const series = useMemo(() => [{ name: "Billed", data: [...billed] }, { name: "Collected", data: [...collected] }], [billed, collected]);
  return <Chart type="area" height={235} options={options} series={series} />;
}

/** Waiting time as columns, satisfaction as a line over them, each on its own axis. */
export function QualityChart({ categories, wait, satisfaction }: { categories: readonly string[]; wait: readonly number[]; satisfaction: readonly number[] }) {
  const options = useMemo<ApexOptions>(() => base({
    chart: { type: "line" },
    colors: [amber, violet],
    stroke: { width: [0, 3], curve: "smooth", lineCap: "round" },
    plotOptions: { bar: { columnWidth: "34%", borderRadius: 7, borderRadiusApplication: "end" } },
    fill: { type: ["gradient", "solid"], gradient: { shade: "light", type: "vertical", gradientToColors: [palette.amber[200]], opacityFrom: 1, opacityTo: 1, stops: [0, 100] } },
    markers: { size: [0, 5], colors: ["#fff"], strokeColors: violet, strokeWidth: 3, hover: { size: 7 } },
    xaxis: { categories: [...categories], axisBorder: { show: false }, axisTicks: { show: false }, labels: axisLabels, crosshairs: { show: false } },
    yaxis: [
      { seriesName: "Average wait", min: 0, tickAmount: 4, labels: { ...axisLabels, minWidth: 30, formatter: (value) => `${Math.round(value)}m` } },
      { seriesName: "Satisfaction", opposite: true, min: 80, max: 100, tickAmount: 4, labels: { ...axisLabels, minWidth: 30, formatter: (value) => `${Math.round(value)}%` } },
    ],
    tooltip: { theme: "light", shared: true, intersect: false },
  }), [categories]);
  const series = useMemo(() => [
    { name: "Average wait", type: "column", data: [...wait] },
    { name: "Satisfaction", type: "line", data: [...satisfaction] },
  ], [wait, satisfaction]);
  return <Chart type="line" height={235} options={options} series={series} />;
}

/** Share of visits by department as a ring with the total in the middle. */
export function DepartmentDonut({ names, values, colors, total }: { names: readonly string[]; values: readonly number[]; colors: readonly string[]; total: string }) {
  const size = 188;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const gap = stroke + 7; // round caps stick out by half the stroke at each end, so add that back to leave a visible space
  const sum = values.reduce((a, b) => a + b, 0);
  let offset = 0;
  return (
    <div className={styles.donutWrap} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Visits by department">
        {values.map((value, index) => {
          const share = value / sum;
          const length = Math.max(share * circumference - gap, 0.01);
          const segment = (
            <circle
              key={names[index]}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={colors[index]}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-(offset + gap / 2)}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            >
              <title>{`${names[index]}: ${value} visits`}</title>
            </circle>
          );
          offset += share * circumference;
          return segment;
        })}
      </svg>
      <div className={styles.donutCenter}>
        <span className={styles.donutTotal}>{total}</span>
        <span className="text-small text-muted">visits</span>
      </div>
    </div>
  );
}

/** Average visits per weekday, the busiest day picked out in the brand green and the rest in a soft tint. */
export function WeekdayChart({ days, values }: { days: readonly string[]; values: readonly number[] }) {
  const peak = values.indexOf(Math.max(...values));
  const options = useMemo<ApexOptions>(() => base({
    chart: { type: "bar" },
    colors: values.map((_, index) => (index === peak ? green : palette.primary[200])),
    plotOptions: { bar: { distributed: true, columnWidth: "52%", borderRadius: 8, borderRadiusApplication: "end" } },
    fill: { type: "gradient", gradient: { shade: "light", type: "vertical", shadeIntensity: 0.1, gradientToColors: values.map((_, index) => (index === peak ? palette.primary[300] : palette.primary[100])), opacityFrom: 1, opacityTo: 1, stops: [0, 100] } },
    xaxis: { categories: [...days], axisBorder: { show: false }, axisTicks: { show: false }, labels: axisLabels, crosshairs: { show: false } },
    yaxis: { tickAmount: 4, labels: { ...axisLabels, minWidth: 28, formatter: (value) => `${Math.round(value)}` } },
    tooltip: { theme: "light", shared: false, intersect: true, x: { show: true }, y: { formatter: (value) => `${value} visits on average` } },
  }), [days, values, peak]);
  return <Chart type="bar" height={220} options={options} series={[{ name: "Visits", data: [...values] }]} />;
}
