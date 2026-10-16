"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Select } from "@/components/ui/select";
import { palette } from "@/lib/tokens";
import { departmentRanges, departments, type DepartmentRange } from "./data";
import styles from "./dashboard.module.css";

// Bigger shares get a deeper green.
function greenFor(share: number) {
  if (share >= 30) return palette.primary[700];
  if (share >= 20) return palette.primary[600];
  if (share >= 12) return palette.primary[500];
  return palette.primary[400];
}

export function DepartmentOverview() {
  const [range, setRange] = useState<DepartmentRange>("Weekly");
  const rows = departments[range];
  const largest = Math.max(...rows.map(({ share }) => share));

  return (
    <Card
      title="Departments"
      description="Share of patients"
      action={<Select aria-label="Department range" value={range} options={departmentRanges} onChange={setRange} />}
    >
      <ul className={styles.departmentList}>
        {rows.map(({ name, patients, share }) => (
          <li key={name} className={styles.department}>
            <span className={styles.departmentName}>
              <span className="text-label">{name}</span>
              <span className="text-small text-muted num">{patients.toLocaleString("en-US")} patients</span>
            </span>
            <span className={styles.bar}>
              {/* Scaled to the largest department, so the longest bar is always full. */}
              <ProgressBar
                value={(share / largest) * 100}
                color={greenFor(share)}
                size="sm"
                aria-label={`${name} share`}
                aria-valuetext={`${share}%`}
              />
            </span>
            <span className={`text-label num ${styles.percent}`}>{share}%</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
