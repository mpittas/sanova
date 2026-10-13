"use client";

import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import { Chart } from "./chart";

export function Sparkline({
  data,
  color,
  name,
  height = 52,
}: {
  data: number[];
  color: string;
  name: string;
  height?: number;
}) {
  const options = useMemo<ApexOptions>(
    () => ({
      chart: { type: "area", sparkline: { enabled: true }, fontFamily: "inherit" },
      colors: [color],
      stroke: { curve: "smooth", width: 2 },
      fill: {
        type: "gradient",
        gradient: { shadeIntensity: 1, opacityFrom: 0.22, opacityTo: 0, stops: [0, 100] },
      },
      tooltip: { enabled: false },
    }),
    [color],
  );
  const series = useMemo(() => [{ name, data }], [name, data]);

  return <Chart type="area" height={height} options={options} series={series} />;
}
