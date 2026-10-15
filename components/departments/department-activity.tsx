"use client";

import { useMemo, useState } from "react";
import type { ApexOptions } from "apexcharts";
import { Chart } from "@/components/charts/chart";
import { Card } from "@/components/ui/card";
import { Delta } from "@/components/ui/delta";
import { Legend, LegendItem } from "@/components/ui/legend";
import { Select } from "@/components/ui/select";
import { palette } from "@/lib/tokens";
import { activity, activityMonths, activityRanges, departments, latestGrowth, type ActivityRange } from "./data";
import styles from "./departments.module.css";

const colors = departments.map(({ tone }) => palette[tone][500]);

export function DepartmentActivity() {
  const [range, setRange] = useState<ActivityRange>("This Year");
  const data = activity[range];

  const options = useMemo<ApexOptions>(
    () => ({
      chart: { type: "line", fontFamily: "inherit", toolbar: { show: false }, zoom: { enabled: false }, animations: { speed: 500 } },
      colors,
      legend: { show: false },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 3, lineCap: "round" },
      markers: { size: 0, hover: { size: 5 } },
      grid: { borderColor: palette.neutral[100], strokeDashArray: 4, padding: { left: 8, right: 8 } },
      xaxis: {
        categories: [...activityMonths],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: palette.neutral[500], fontSize: "12px" } },
        tooltip: { enabled: false },
      },
      yaxis: {
        min: 0,
        max: 500,
        tickAmount: 5,
        labels: { style: { colors: palette.neutral[500], fontSize: "12px" } },
      },
      tooltip: { shared: true, intersect: false, y: { formatter: (value: number) => `${value} appointments` } },
    }),
    [],
  );
  const series = useMemo(() => departments.map(({ name }) => ({ name, data: data[name] })), [data]);

  return (
    <Card
      rounded
      title="Department Activity"
      description="Appointment volume across departments"
      action={<Select aria-label="Activity range" value={range} options={activityRanges} onChange={setRange} />}
    >
      <div className={styles.activity}>
        <Chart type="line" height={280} options={options} series={series} />
        <Legend className={styles.activityLegend}>
          {departments.map(({ name }, index) => (
            <LegendItem
              key={name}
              color={colors[index]}
              label={name}
              detail={data[name].at(-1)}
              value={<Delta value={`${latestGrowth(data[name])}%`} />}
            />
          ))}
        </Legend>
      </div>
    </Card>
  );
}
