"use client";

import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import { Chart } from "./chart";

export function Sparkline({
  data,
  color,
  name,
  height = 84,
}: {
  data: number[];
  color: string;
  name: string;
  height?: number;
}) {
  const options = useMemo<ApexOptions>(() => {
    // Leave room under the line so the area fill has height to fade out in, and above it so the stroke isn't clipped.
    const low = Math.min(...data);
    const high = Math.max(...data);
    const range = high - low || 1;

    return {
      chart: { type: "area", sparkline: { enabled: true }, fontFamily: "inherit", animations: { speed: 500 } },
      colors: [color],
      stroke: { curve: "smooth", width: 2, lineCap: "round" },
      fill: {
        type: "gradient",
        gradient: { shade: "light", type: "vertical", shadeIntensity: 0, opacityFrom: 0.4, opacityTo: 0, stops: [0, 100] },
      },
      yaxis: { min: low - range * 0.9, max: high + range * 0.2 },
      tooltip: { enabled: false },
    };
  }, [color, data]);
  const series = useMemo(() => [{ name, data }], [name, data]);

  return <Chart type="area" height={height} options={options} series={series} />;
}
