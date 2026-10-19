"use client";

import { useState } from "react";
import { HyperLines, type LineSeries } from "@/components/charts/hyper-lines";
import { palette } from "@/lib/tokens";
import { Card } from "@/components/ui/card";
import { Legend, LegendItem } from "@/components/ui/legend";
import { Segmented } from "@/components/ui/segmented";
import { ChartSummary } from "./chart-summary";
import { appointmentTrends, trendRanges, type TrendRange } from "./data";
import styles from "./dashboard.module.css";

const sum = (values: readonly number[]) => values.reduce((total, value) => total + value, 0);

export function AppointmentTrends() {
  const [range, setRange] = useState<TrendRange>("Monthly");
  const { categories, inPerson, telemedicine, change } = appointmentTrends[range];
  const total = sum(inPerson) + sum(telemedicine);
  const series: LineSeries[] = [
    { name: "In-person", data: inPerson, tone: "primary" },
    { name: "Telemedicine", data: telemedicine, tone: "primary", soft: true },
  ];

  return (
    <Card
      title="Appointment trends"
      description="In-person and telemedicine visits"
      action={<Segmented aria-label="Trend range" value={range} options={trendRanges} onChange={setRange} />}
    >
      <div className={styles.chartHead}>
        <ChartSummary value={total.toLocaleString("en-US")} label="Total appointments" change={change} />
        <Legend direction="row">
          {series.map(({ name, tone, soft }) => (
            <LegendItem key={name} color={palette[tone][soft ? 300 : 500]} label={name} />
          ))}
        </Legend>
      </div>
      <HyperLines
        categories={categories}
        series={series}
        height={220}
        label={`Appointments per ${range === "Weekly" ? "day" : "month"}, in-person and telemedicine`}
      />
    </Card>
  );
}
