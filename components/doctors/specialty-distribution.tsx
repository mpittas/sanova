"use client";

import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import { Chart } from "@/components/charts/chart";
import { Card } from "@/components/ui/card";
import { Legend, LegendItem } from "@/components/ui/legend";
import { palette } from "@/lib/tokens";
import { buildDistribution, type Doctor } from "./data";
import styles from "./doctors.module.css";

const colorOf = (tone: ReturnType<typeof buildDistribution>[number]["tone"]) =>
  tone === "neutral" ? palette.neutral[300] : palette[tone][400];

export function SpecialtyDistribution({ doctors }: { doctors: readonly Doctor[] }) {
  const total = doctors.length;
  const distribution = useMemo(() => buildDistribution(doctors), [doctors]);
  const colors = useMemo(() => distribution.map(({ tone }) => colorOf(tone)), [distribution]);

  const options = useMemo<ApexOptions>(
    () => ({
      chart: { type: "donut", fontFamily: "inherit", animations: { speed: 500 } },
      colors,
      labels: distribution.map(({ label }) => label),
      legend: { show: false },
      dataLabels: { enabled: false },
      stroke: { width: 3, colors: ["#fff"] },
      tooltip: { y: { formatter: (value: number) => `${value} ${value === 1 ? "doctor" : "doctors"}` } },
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
                formatter: () => String(total),
              },
              total: {
                show: true,
                showAlways: true,
                label: "Doctors",
                fontSize: "13px",
                color: palette.neutral[500],
                formatter: () => String(total),
              },
            },
          },
        },
      },
    }),
    [colors, distribution, total],
  );
  const series = useMemo(() => distribution.map(({ count }) => count), [distribution]);

  return (
    <Card rounded title="Specialty Distribution" description="Doctors by specialty">
      <div className={styles.distribution}>
        <Chart type="donut" height={188} width={188} options={options} series={series} />
        <Legend className={styles.legend}>
          {distribution.map(({ label, count }, index) => (
            <LegendItem
              key={label}
              color={colors[index]}
              label={label}
              detail={count}
              value={`${Math.round((count / total) * 100)}%`}
            />
          ))}
        </Legend>
      </div>
    </Card>
  );
}
