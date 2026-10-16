"use client";

import { useState } from "react";
import { HyperBars } from "@/components/charts/hyper-bars";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { demographics, periods, type Period } from "./data";
import styles from "./dashboard.module.css";

const colors = [{ tone: "primary" }, { tone: "primary", soft: true }, { tone: "neutral" }] as const;

export function PatientDemographics() {
  const [period, setPeriod] = useState<Period>("This Year");
  const { total, groups } = demographics[period];

  return (
    <Card
      title="Demographics"
      description="Patients by gender"
      action={<Select aria-label="Demographics period" value={period} options={periods} onChange={setPeriod} />}
    >
      <div className={styles.demographics}>
        <div>
          <p className="text-h2 num">{total.toLocaleString("en-US")}</p>
          <p className="text-small text-muted">Total patients</p>
        </div>
        <HyperBars
          label="Patients by gender"
          rows={groups.map((group, index) => ({
            label: group.label,
            share: group.share,
            ...colors[index],
            detail: Math.round((total * group.share) / 100).toLocaleString("en-US"),
            value: `${group.share}%`,
          }))}
        />
      </div>
    </Card>
  );
}
