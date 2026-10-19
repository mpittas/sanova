"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Segmented } from "@/components/ui/segmented";
import { palette } from "@/lib/tokens";
import { demographics, patientStatistics, periods, type Period } from "./data";
import styles from "./dashboard.module.css";

const colours = [palette.primary[500], palette.primary[300], palette.neutral[300]];

const SIZE = 148;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 5;

/** A ring split by share, with the patient total in the middle. Segments are separated by small gaps and rounded ends. */
function Donut({ total, shares }: { total: number; shares: readonly number[] }) {
  let offset = 0;
  return (
    <div className={styles.donutWrap}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Patients by gender" className={styles.donutSvg}>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke={palette.neutral[100]} strokeWidth={STROKE} />
        {shares.map((share, index) => {
          const length = Math.max((share / 100) * CIRCUMFERENCE - GAP, 0.01);
          const circle = (
            <circle
              key={index}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={colours[index]}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />
          );
          offset += (share / 100) * CIRCUMFERENCE;
          return circle;
        })}
      </svg>
      <div className={styles.donutCenter}>
        <span className={styles.donutTotal}>{total.toLocaleString("en-US")}</span>
        <span className="text-small text-muted">patients</span>
      </div>
    </div>
  );
}

export function PatientDemographics() {
  const [period, setPeriod] = useState<Period>("This Year");
  const { total, groups } = demographics[period];
  const { returning, newPatients } = patientStatistics[period];

  return (
    <Card
      title="Demographics"
      description="Patients by gender"
      action={<Segmented aria-label="Demographics period" value={period} options={periods} onChange={setPeriod} />}
    >
      <div className={styles.demographics}>
        <div className={styles.donutRow}>
          <Donut total={total} shares={groups.map(({ share }) => share)} />
          <ul className={styles.donutLegend}>
            {groups.map(({ label, share }, index) => (
              <li key={label}>
                <span className={styles.donutSwatch} style={{ background: colours[index] }} aria-hidden />
                <span className="text-small">{label}</span>
                <span className={styles.donutShare}>{share}%</span>
              </li>
            ))}
          </ul>
        </div>

        <dl className={styles.patientMix} aria-label="Patient mix">
          <div>
            <dd>{returning.toLocaleString("en-US")}</dd>
            <dt>Returning</dt>
          </div>
          <div>
            <dd>{newPatients.toLocaleString("en-US")}</dd>
            <dt>New</dt>
          </div>
        </dl>
      </div>
    </Card>
  );
}
