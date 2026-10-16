"use client";

import { useState } from "react";
import { hyperGradient } from "@/components/charts/hyper";
import { HyperColumns, type HyperSeries } from "@/components/charts/hyper-columns";
import { Card } from "@/components/ui/card";
import { Legend, LegendItem } from "@/components/ui/legend";
import { Select } from "@/components/ui/select";
import { appointmentTrends, trendRanges, type TrendRange } from "./data";
import styles from "./dashboard.module.css";

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

export function AppointmentTrends() {
  const [range, setRange] = useState<TrendRange>("Monthly");
  const { categories, inPerson, telemedicine } = appointmentTrends[range];
  const total = sum(inPerson) + sum(telemedicine);
  const series: HyperSeries[] = [
    { name: "In-person", data: inPerson, tone: "primary" },
    { name: "Telemedicine", data: telemedicine, tone: "primary", soft: true },
  ];

  return (
    <Card
      title="Appointment trends"
      description="In-person and telemedicine visits"
      action={<Select aria-label="Trend range" value={range} options={trendRanges} onChange={setRange} />}
    >
      <div className={styles.trendSummary}>
        <div>
          <p className="text-h2 num">{total.toLocaleString("en-US")}</p>
          <p className="text-small text-muted">Total appointments</p>
        </div>
        <Legend direction="row">
          {series.map(({ name, tone, soft }) => (
            <LegendItem key={name} color={hyperGradient({ tone, soft })} label={name} />
          ))}
        </Legend>
      </div>
      <HyperColumns
        categories={categories}
        series={series}
        height={240}
        label={`Appointments per ${range === "Weekly" ? "day" : "month"}, in-person and telemedicine`}
      />
    </Card>
  );
}
