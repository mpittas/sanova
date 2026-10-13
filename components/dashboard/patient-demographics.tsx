"use client";

import { useMemo, useState, type CSSProperties } from "react";
import type { ApexOptions } from "apexcharts";
import { Chart } from "@/components/charts/chart";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { palette } from "@/lib/tokens";
import { demographics, periods, type Period } from "./data";
import styles from "./dashboard.module.css";

const colors = [palette.primary[400], palette.violet[400], palette.amber[400]];

export function PatientDemographics() {
  const [period, setPeriod] = useState<Period>("This Year");
  const { total, groups } = demographics[period];

  const options = useMemo<ApexOptions>(
    () => ({
      chart: { type: "donut", fontFamily: "inherit", animations: { speed: 500 } },
      colors,
      labels: groups.map((group) => group.label),
      legend: { show: false },
      dataLabels: { enabled: false },
      stroke: { width: 3, colors: ["#fff"] },
      tooltip: { y: { formatter: (value: number) => `${value}%` } },
      plotOptions: {
        pie: {
          donut: {
            size: "72%",
            labels: {
              show: true,
              name: { show: true, offsetY: 18, fontSize: "13px", color: palette.neutral[500] },
              value: {
                show: true,
                offsetY: -14,
                fontSize: "26px",
                fontWeight: 600,
                color: palette.neutral[900],
                formatter: () => total.toLocaleString("en-US"),
              },
              total: {
                show: true,
                showAlways: true,
                label: "Patients",
                fontSize: "13px",
                color: palette.neutral[500],
                formatter: () => total.toLocaleString("en-US"),
              },
            },
          },
        },
      },
    }),
    [groups, total],
  );
  const series = useMemo(() => groups.map((group) => group.share), [groups]);

  return (
    <Card
      title="Patient Demographics"
      description="Breakdown by gender"
      action={<Select aria-label="Demographics period" value={period} options={periods} onChange={setPeriod} />}
    >
      <div className={styles.demographics}>
        <div className={styles.donut}>
          <Chart type="donut" height={190} width={190} options={options} series={series} />
        </div>
        <ul className={styles.legend}>
          {groups.map((group, index) => (
            <li key={group.label} className={styles.legendItem}>
              <span className={styles.swatch} style={{ "--swatch": colors[index] } as CSSProperties} />
              <span className={`text-small ${styles.legendLabel}`}>{group.label}</span>
              <span className="text-small text-muted num">{Math.round((total * group.share) / 100).toLocaleString("en-US")}</span>
              <span className={`text-label num ${styles.legendShare}`}>{group.share}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
