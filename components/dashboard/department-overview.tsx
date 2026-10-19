"use client";

import { useState, type CSSProperties } from "react";
import { Card } from "@/components/ui/card";
import { Segmented } from "@/components/ui/segmented";
import { ToneTile } from "@/components/ui/tone-tile";
import { palette } from "@/lib/tokens";
import { departmentRanges, departments, type DepartmentRange } from "./data";
import styles from "./dashboard.module.css";

export function DepartmentOverview() {
  const [range, setRange] = useState<DepartmentRange>("Weekly");
  const [active, setActive] = useState<string | null>(null);
  const rows = departments[range];
  const total = rows.reduce((sum, { patients }) => sum + patients, 0);
  const leader = rows.reduce((top, row) => (row.share > top.share ? row : top));

  return (
    <Card
      title="Departments"
      description="Share of patients"
      action={<Segmented aria-label="Department range" value={range} options={departmentRanges} onChange={setRange} />}
    >
      <div className={styles.deptSummary}>
        <p className={styles.deptTotal}>
          {total.toLocaleString("en-US")}
          <span className="text-small text-muted">patients {range === "Weekly" ? "this week" : "this month"}</span>
        </p>
        <p className={`text-small text-muted ${styles.deptLeader}`}>
          Most visited: <strong>{leader.name}</strong>
        </p>
      </div>

      {/* One bar split by share: each segment takes the colour of its department. */}
      <div className={styles.deptStrip} role="img" aria-label="Share of patients by department">
        {rows.map(({ name, share, tone }) => (
          <span
            key={name}
            className={styles.deptSegment}
            data-dim={active !== null && active !== name ? "" : undefined}
            style={{ flexGrow: share, backgroundColor: palette[tone][500] }}
          />
        ))}
      </div>

      <ul className={styles.deptList} onMouseLeave={() => setActive(null)}>
        {rows.map(({ name, patients, share, icon: Icon, tone }) => (
          <li
            key={name}
            className={styles.deptRow}
            data-dim={active !== null && active !== name ? "" : undefined}
            style={{ "--dept": palette[tone][500] } as CSSProperties}
            onMouseEnter={() => setActive(name)}
          >
            <ToneTile tone={tone} size={36}>
              <Icon />
            </ToneTile>
            <span className={styles.departmentName}>
              <span className="text-label">{name}</span>
              <span className="text-small text-muted">
                {patients.toLocaleString("en-US")} patients
              </span>
            </span>
            <span className={styles.deptShare}>{share}%</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
