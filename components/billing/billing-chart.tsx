"use client";

import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import { Chart } from "@/components/charts/chart";
import { money } from "./data";

export function BillingChart({ points }: { points: { date: string; paid: number; open: number }[] }) {
  // The bucket with the highest single value gets a marker, so the eye has somewhere to start.
  const peak = points.reduce((best, point) => (Math.max(point.paid, point.open) > Math.max(best.paid, best.open) ? point : best), points[0]);
  const peakValue = peak ? Math.max(peak.paid, peak.open) : 0;
  const options = useMemo<ApexOptions>(() => ({
    annotations: peakValue ? { points: [{ x: new Date(`${peak.date}T00:00:00Z`).getTime(), y: peakValue / 100, marker: { size: 5, fillColor: "#fff", strokeColor: peak.paid >= peak.open ? "#139A68" : "#6366f1", strokeWidth: 3 }, label: { text: `Peak, ${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${peak.date}T00:00:00Z`))}`, offsetY: -6, borderColor: "transparent", borderRadius: 6, style: { background: "#1f2b25", color: "#fff", fontSize: "10px", fontWeight: 500, padding: { left: 7, right: 7, top: 3, bottom: 4 } } } }] } : {},
    chart: { type: "area", fontFamily: "inherit", toolbar: { show: false }, zoom: { enabled: false }, animations: { enabled: true, speed: 650 }, parentHeightOffset: 0, dropShadow: { enabled: true, top: 6, left: 0, blur: 8, color: "#139A68", opacity: .16 } },
    colors: ["#10b981", "#6366f1"],
    stroke: { curve: "smooth", width: [2.25, 2], lineCap: "round" },
    fill: { type: "gradient", gradient: { shade: "light", type: "vertical", shadeIntensity: 1, gradientToColors: ["#06b6d4", "#a78bfa"], opacityFrom: .55, opacityTo: .04, stops: [0, 90, 100] } },
    dataLabels: { enabled: false },
    markers: { size: 0, strokeColors: "#fff", strokeWidth: 3, hover: { size: 6 }, discrete: [] },
    legend: { show: false },
    grid: { borderColor: "#eef1f0", strokeDashArray: 0, xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } }, padding: { top: -6, right: 14, bottom: -6, left: 6 } },
    xaxis: { type: "datetime", axisBorder: { show: false }, axisTicks: { show: false }, labels: { datetimeUTC: true, format: "MMM d", style: { colors: "#718077", fontSize: "10px" }, hideOverlappingLabels: true }, tooltip: { enabled: false }, crosshairs: { stroke: { color: "#10b981", width: 1.5, dashArray: 0 } } },
    yaxis: { min: 0, tickAmount: 3, forceNiceScale: true, labels: { minWidth: 38, style: { colors: ["#718077"], fontSize: "10px" }, formatter: (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 0 }).format(value) } },
    tooltip: { theme: "light", shared: true, intersect: false, x: { format: "MMM d, yyyy" }, y: { formatter: (value) => value === null ? "—" : money(Math.round(value * 100)) } },
  }), [peak, peakValue]);
  const series = useMemo(() => [
    { name: "Collected", data: points.map((point) => ({ x: `${point.date}T00:00:00Z`, y: point.paid / 100 })) },
    { name: "Outstanding", data: points.map((point) => ({ x: `${point.date}T00:00:00Z`, y: point.open / 100 })) },
  ], [points]);
  return <Chart type="area" height={300} options={options} series={series} />;
}
