"use client";

import { useMemo, useState, type CSSProperties } from "react";
import type { ApexOptions } from "apexcharts";
import { Chart } from "@/components/charts/chart";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { palette } from "@/lib/tokens";
import { appointmentTrends, trendRanges, type TrendRange } from "./data";
import styles from "./dashboard.module.css";

const colors = [palette.primary[500], palette.primary[200]];
const seriesNames = ["In-person", "Telemedicine"];
const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

export function AppointmentTrends() {
  const [range, setRange] = useState<TrendRange>("Monthly");
  const { categories, inPerson, telemedicine, max } = appointmentTrends[range];
  const total = sum(inPerson) + sum(telemedicine);

  const options = useMemo<ApexOptions>(
    () => ({
      chart: { type: "bar", fontFamily: "inherit", toolbar: { show: false }, animations: { speed: 400 } },
      colors,
      legend: { show: false },
      dataLabels: { enabled: false },
      plotOptions: {
        bar: { columnWidth: "60%", borderRadius: 4, borderRadiusApplication: "end" },
      },
      stroke: { show: true, width: 2, colors: ["transparent"] },
      grid: {
        borderColor: palette.neutral[100],
        strokeDashArray: 4,
        padding: { left: 4, right: 0 },
      },
      xaxis: {
        categories,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: palette.neutral[500], fontSize: "12px" } },
        crosshairs: { show: false },
      },
      yaxis: {
        min: 0,
        max,
        tickAmount: 4,
        labels: { style: { colors: palette.neutral[500], fontSize: "12px" } },
      },
      tooltip: { shared: true, intersect: false },
    }),
    [categories, max],
  );
  const series = useMemo(
    () => [
      { name: seriesNames[0], data: inPerson },
      { name: seriesNames[1], data: telemedicine },
    ],
    [inPerson, telemedicine],
  );

  return (
    <Card
      title="Appointment Trends"
      description="In-person vs telemedicine visits"
      action={<Select aria-label="Trend range" value={range} options={trendRanges} onChange={setRange} />}
    >
      <div className={styles.trendSummary}>
        <div>
          <p className="text-h2 num">{total.toLocaleString("en-US")}</p>
          <p className="text-small text-muted">Total appointments</p>
        </div>
        <ul className={styles.legendInline}>
          {seriesNames.map((name, index) => (
            <li key={name} className={styles.legendItem}>
              <span className={styles.swatch} style={{ "--swatch": colors[index] } as CSSProperties} />
              <span className="text-small">{name}</span>
            </li>
          ))}
        </ul>
      </div>
      <Chart type="bar" height={200} options={options} series={series} />
    </Card>
  );
}
