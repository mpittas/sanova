"use client";

import { useState } from "react";
import { LuArrowDownToLine, LuCalendarCheck, LuClock3, LuSmile, LuWallet } from "react-icons/lu";
import { ChartSummary } from "@/components/dashboard/chart-summary";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Delta } from "@/components/ui/delta";
import { Legend, LegendItem } from "@/components/ui/legend";
import { Segmented } from "@/components/ui/segmented";
import { StatGrid, StatTile } from "@/components/ui/stat-tile";
import { Table, Th } from "@/components/ui/table";
import { palette } from "@/lib/tokens";
import { DepartmentDonut, QualityChart, RevenueChart, VisitsHeatmap, WeekdayChart, heatRamp } from "./reports-charts";
import { busiestDays, departmentMix, last, monthly, months, percentChange, rangeLength, ranges, sum, type Range } from "./data";
import styles from "./reports.module.css";

const thousands = (value: number) => `$${value.toFixed(1)}K`;
const count = (value: number) => value.toLocaleString("en-US");

function exportSummary(rows: string[][], filename: string) {
  const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["﻿", csv], { type: "text/csv;charset=utf-8;" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ReportsView() {
  const [range, setRange] = useState<Range>("6 months");
  const length = rangeLength[range];
  const labels = last(months, length);
  const inPerson = last(monthly.inPerson, length);
  const telemedicine = last(monthly.telemedicine, length);
  const billed = last(monthly.billed, length);
  const collected = last(monthly.collected, length);
  const wait = last(monthly.wait, length);
  const satisfaction = last(monthly.satisfaction, length);
  const visits = inPerson.map((value, index) => value + telemedicine[index]);
  const totalVisits = sum(visits);
  const totalCollected = sum(collected);
  const totalBilled = sum(billed);
  const since = `since ${labels[0]}`;
  const departmentVisits = departmentMix.map(({ share }) => Math.round((totalVisits * share) / 100));
  const departmentColors = departmentMix.map(({ tone }) => palette[tone][500]);
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => {
    const dates = Object.entries(busiestDays).filter(([date]) => new Date(2024, 4, Number(date)).getDay() === index + 1).map(([, value]) => value);
    return { day, average: Math.round(sum(dates) / dates.length) };
  });
  const weekdayWeight = sum(weekdays.map(({ average }) => average));
  const heatmap = weekdays.map(({ average }) => visits.map((total) => Math.round((total * average) / weekdayWeight)));
  const busiest = weekdays.reduce((top, item) => (item.average > top.average ? item : top));
  const tableRows = labels.map((month, index) => ({
    month,
    visits: visits[index],
    collected: collected[index],
    rate: Math.round((collected[index] / billed[index]) * 100),
    wait: wait[index],
    satisfaction: satisfaction[index],
  })).toReversed();

  return (
    <div className={styles.page}>
      <PageHeader
        title="Reports"
        description="See how the clinic is doing: visits, revenue, waiting times and patient satisfaction."
        actions={
          <div className={styles.exportRow}>
            <Segmented aria-label="Report range" value={range} options={ranges} onChange={setRange} />
            <Button
              variant="secondary"
              iconLeft={<LuArrowDownToLine />}
              onClick={() =>
                exportSummary(
                  [["Month", "Visits", "Collected ($K)", "Collection rate (%)", "Average wait (min)", "Satisfaction (%)"], ...tableRows.toReversed().map((row) => [row.month, String(row.visits), row.collected.toFixed(1), String(row.rate), String(row.wait), String(row.satisfaction)])],
                  `sanova-report-${range.replace(" ", "-")}`,
                )
              }
            >
              Export CSV
            </Button>
          </div>
        }
      />

      <StatGrid>
        <StatTile label="Patient visits" value={count(totalVisits)} icon={LuCalendarCheck} tone="primary" change={percentChange(visits[0], visits[length - 1])} period={`${since}, per month`} trend={visits} />
        <StatTile label="Revenue collected" value={thousands(totalCollected)} icon={LuWallet} tone="blue" change={percentChange(collected[0], collected[length - 1])} period={`${since}, per month`} trend={collected} />
        <StatTile label="Average wait" value={`${wait[length - 1]} min`} icon={LuClock3} tone="amber" period={`Down from ${wait[0]} min ${since}`} trend={wait} />
        <StatTile label="Satisfaction" value={`${satisfaction[length - 1]}%`} icon={LuSmile} tone="violet" change={`${satisfaction[length - 1] - satisfaction[0]} pts`} period={since} trend={satisfaction} />
      </StatGrid>

      <div className={`${styles.row} ${styles.rowWide}`}>
        <Card title="Visits" description="Visits by weekday and month" action={<Delta value={percentChange(visits[0], visits[length - 1])} variant="chip" />}>
          <VisitsHeatmap months={labels} days={weekdays.map(({ day }) => day)} matrix={heatmap} />
          <div className={styles.heatScale} aria-hidden>
            <span className="text-small text-muted">Quieter</span>
            <span className={styles.heatRamp}>{heatRamp.map((color) => <i key={color} style={{ background: color }} />)}</span>
            <span className="text-small text-muted">Busier</span>
          </div>
          <dl className={styles.facts}>
            <div><dt>Monthly average</dt><dd className="num">{count(Math.round(totalVisits / length))}</dd></div>
            <div><dt>Busiest month</dt><dd className="num">{labels[visits.indexOf(Math.max(...visits))]} · {count(Math.max(...visits))}</dd></div>
            <div><dt>Telemedicine share</dt><dd className="num">{Math.round((telemedicine[0] / visits[0]) * 100)}% → {Math.round((telemedicine[length - 1] / visits[length - 1]) * 100)}%</dd></div>
          </dl>
        </Card>

        <Card title="Departments" description="Share of visits">
          <DepartmentDonut names={departmentMix.map(({ name }) => name)} values={departmentVisits} colors={departmentColors} total={count(totalVisits)} />
          <Legend className={styles.departmentLegend}>
            {departmentMix.map(({ name, share }, index) => (
              <LegendItem key={name} color={departmentColors[index]} label={name} detail={count(departmentVisits[index])} value={`${share}%`} />
            ))}
          </Legend>
        </Card>
      </div>

      <div className={styles.row}>
        <Card title="Revenue" description="Billed against collected">
          <div className={styles.chartHead}>
            <ChartSummary value={thousands(totalBilled)} label="Total billed" change={percentChange(billed[0], billed[length - 1])} />
            <Legend direction="row">
              <LegendItem color={palette.violet[500]} label="Billed" />
              <LegendItem color={palette.primary[500]} label="Collected" />
            </Legend>
          </div>
          <RevenueChart categories={labels} billed={billed} collected={collected} />
        </Card>

        <Card title="Patient experience" description="Average wait against satisfaction">
          <div className={styles.chartHead}>
            <ChartSummary value={`${satisfaction[length - 1]}%`} label={`Satisfaction, wait down ${wait[0] - wait[length - 1]} min`} change={`${satisfaction[length - 1] - satisfaction[0]} pts`} />
            <Legend direction="row">
              <LegendItem color={palette.amber[500]} label="Average wait" />
              <LegendItem color={palette.violet[500]} label="Satisfaction" />
            </Legend>
          </div>
          <QualityChart categories={labels} wait={wait} satisfaction={satisfaction} />
        </Card>
      </div>

      <div className={styles.row}>
        <Card title="Busiest days" description={`Average visits per weekday, ${busiest.day} is the peak`}>
          <WeekdayChart days={weekdays.map(({ day }) => day)} values={weekdays.map(({ average }) => average)} />
        </Card>

        <Card title="Monthly summary" description={`The figures behind the charts, last ${range}`}>
          <Table variant="simple" className={styles.summary} minWidth={460}>
            <thead>
              <tr>
                <Th>Month</Th>
                <Th>Visits</Th>
                <Th>Collected</Th>
                <Th>Wait</Th>
                <Th>Satisfaction</Th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr key={row.month}>
                  <td className={styles.month}>{row.month}</td>
                  <td className="num">{count(row.visits)}</td>
                  <td className="num">{thousands(row.collected)}</td>
                  <td className="num">{row.wait} min</td>
                  <td className="num">{row.satisfaction}%</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
