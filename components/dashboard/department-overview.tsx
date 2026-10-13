"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { ToneTile } from "@/components/ui/tone-tile";
import { departmentRanges, departments, type DepartmentRange } from "./data";
import styles from "./dashboard.module.css";

export function DepartmentOverview() {
  const [range, setRange] = useState<DepartmentRange>("Weekly");

  return (
    <Card
      title="Department Overview"
      description="Share of patients by department"
      action={<Select aria-label="Department range" value={range} options={departmentRanges} onChange={setRange} />}
    >
      <ul className={styles.departmentList}>
        {departments[range].map(({ name, patients, share, icon: Icon, tone }) => (
          <li key={name} className={styles.department} data-tone={tone}>
            <ToneTile tone={tone} size={40}>
              <Icon />
            </ToneTile>
            <span className={styles.departmentName}>
              <span className="text-label">{name}</span>
              <span className="text-small text-muted">{patients.toLocaleString("en-US")} patients</span>
            </span>
            <span
              className={styles.track}
              role="progressbar"
              aria-label={`${name} share`}
              aria-valuenow={share}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span className={styles.fill} style={{ display: "block", width: `${share}%` }} />
            </span>
            <span className={`text-label num ${styles.percent}`}>{share}%</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
