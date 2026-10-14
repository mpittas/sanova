"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Legend, LegendItem } from "@/components/ui/legend";
import { Select } from "@/components/ui/select";
import { patientStatistics, periods, type Period } from "./data";
import styles from "./dashboard.module.css";

const number = new Intl.NumberFormat("en-US");

export function PatientStatistics() {
  const [period, setPeriod] = useState<Period>("This Year");
  const { total, returning, newPatients, daily } = patientStatistics[period];

  return (
    <Card
      title="Patient Statistics"
      description="Patient mix and daily volume"
      action={<Select aria-label="Statistics period" value={period} options={periods} onChange={setPeriod} />}
    >
      <div className={styles.bubbles} role="img" aria-label={`${number.format(total)} total patients`}>
        <div className={`${styles.bubble} ${styles.bubble1}`}>
          <strong className="num">{number.format(total)}</strong>
          <span>Total Patients</span>
        </div>
        <div className={`${styles.bubble} ${styles.bubble2}`}>
          <strong className="num">{number.format(returning)}</strong>
          <span>Returning</span>
        </div>
        <div className={`${styles.bubble} ${styles.bubble3}`}>
          <strong className="num">{number.format(newPatients)}</strong>
          <span>New Patients</span>
        </div>
        <div className={`${styles.bubble} ${styles.bubble4}`}>
          <strong className="num">{number.format(daily)}</strong>
          <span>Daily Average</span>
        </div>
      </div>

      <div className={styles.split}>
        <Legend direction="row">
          <LegendItem color="var(--color-primary-300)" label="Returning" value={`${Math.round((returning / total) * 100)}%`} />
          <LegendItem color="var(--color-primary-500)" label="New" value={`${Math.round((newPatients / total) * 100)}%`} />
        </Legend>
      </div>
    </Card>
  );
}
