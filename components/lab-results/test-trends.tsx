"use client";

import { useMemo, useState } from "react";
import type { ApexOptions } from "apexcharts";
import { addMonths, formatDate } from "@/components/appointments/dates";
import { Chart } from "@/components/charts/chart";
import { Select } from "@/components/ui/select";
import { palette } from "@/lib/tokens";
import { formatRange, formatValue, historyOf, type LabTest } from "./data";
import styles from "./lab-results.module.css";

/** How one parameter has moved over the last six readings, against its reference range. */
export function TestTrends({ test }: { test: LabTest }) {
  const names = test.parameters.map(({ name }) => name);
  const [selected, setSelected] = useState(names[0]);
  const parameter = test.parameters.find(({ name }) => name === selected) ?? test.parameters[0];

  const data = useMemo(() => historyOf(parameter, test.parameters.indexOf(parameter) + test.id.length), [parameter, test]);
  // One reading a month, ending with this test.
  const categories = useMemo(() => data.map((_, index) => formatDate(addMonths(test.date, index - 5), { month: "short", year: "2-digit" })), [data, test.date]);

  const options = useMemo<ApexOptions>(() => {
    // Ranges without a lower limit (e.g. "< 200") start the axis near the data instead of at zero, so the line is readable.
    const lower = parameter.low === 0 ? Math.min(parameter.high, ...data) : Math.min(parameter.low, ...data);
    const min = Math.max(0, lower * 0.85);
    const max = Math.max(parameter.high, ...data) * 1.1;
    return {
      chart: { type: "line", fontFamily: "inherit", toolbar: { show: false }, zoom: { enabled: false }, animations: { speed: 400 } },
      colors: [palette.primary[500]],
      stroke: { curve: "smooth", width: 3, lineCap: "round" },
      markers: { size: 5, strokeWidth: 2, strokeColors: "#fff", hover: { size: 7 } },
      dataLabels: { enabled: false },
      legend: { show: false },
      grid: { borderColor: palette.neutral[100], strokeDashArray: 4, padding: { left: 8, right: 8 } },
      // The reference range is a soft band behind the line.
      annotations: { yaxis: [{ y: parameter.low === 0 ? min : parameter.low, y2: parameter.high, borderColor: "transparent", fillColor: palette.primary[100], opacity: 0.5 }] },
      xaxis: {
        categories,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: palette.neutral[500], fontSize: "12px" } },
        tooltip: { enabled: false },
      },
      yaxis: {
        min,
        max,
        tickAmount: 4,
        labels: { formatter: (value: number) => value.toFixed(parameter.decimals > 0 ? 1 : 0), style: { colors: palette.neutral[500], fontSize: "12px" } },
      },
      tooltip: { y: { formatter: (value: number) => `${formatValue(parameter, value)} ${parameter.unit}` } },
    };
  }, [parameter, data, categories]);
  const series = useMemo(() => [{ name: parameter.name, data }], [parameter, data]);

  return (
    <div className={styles.trends}>
      <div className={styles.trendsHead}>
        <p className="text-small text-muted">
          Reference range <span className="text-label num">{formatRange(parameter)}</span> {parameter.unit}
        </p>
        <Select aria-label="Parameter" value={parameter.name} options={names} onChange={setSelected} />
      </div>
      <Chart type="line" height={280} options={options} series={series} />
    </div>
  );
}
