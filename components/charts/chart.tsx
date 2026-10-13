"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

// ApexCharts needs the DOM, so it is only loaded in the browser.
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type ChartProps = ComponentProps<typeof ReactApexChart>;

/** ApexCharts wrapper that reserves its height while the library loads (no layout shift). */
export function Chart({ height, width = "100%", ...props }: ChartProps) {
  return (
    <div style={{ height, width, minWidth: 0 }}>
      <ReactApexChart height={height} width={width} {...props} />
    </div>
  );
}
