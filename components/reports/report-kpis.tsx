"use client";

import { useId, useState, type CSSProperties, type PointerEvent } from "react";
import { LuCalendarCheck, LuClock3, LuSmile, LuWallet } from "react-icons/lu";
import type { IconType } from "react-icons";
import { Card } from "@/components/ui/card";
import { CountUp } from "@/components/ui/count-up";
import { Delta } from "@/components/ui/delta";
import type { Tone } from "@/components/ui/tone-tile";
import styles from "./report-kpis.module.css";

const thousands = (value: number) => `$${value.toFixed(1)}K`;
const count = (value: number) => value.toLocaleString("en-US");

type Metric = {
  id: string;
  label: string;
  icon: IconType;
  tone: Tone;
  /** One value per month, oldest first. The line is drawn from these. */
  series: readonly number[];
  format: (value: number) => string;
  unit?: string;
  /** What the figure shows at rest (a total, or the latest value) and what it says underneath. */
  rest: { figure: string; caption: string };
  /** What a month's value means, e.g. "visits". */
  perMonth: string;
  change: { value: string; direction?: "up" | "down" };
};

type Props = {
  months: readonly string[];
  visits: readonly number[];
  collected: readonly number[];
  wait: readonly number[];
  satisfaction: readonly number[];
  visitsChange: string;
  revenueChange: string;
};

/** Smooth path through the points (horizontal tangents at every point), in a 100 x 40 box. */
function curve(points: readonly [number, number][]) {
  return points.reduce((path, [x, y], index) => {
    if (index === 0) return `M${x},${y}`;
    const [px, py] = points[index - 1];
    const mid = (px + x) / 2;
    return `${path} C${mid},${py} ${mid},${y} ${x},${y}`;
  }, "");
}

/** Line chart that fills its card's width. Move across it and the card's figure follows the month under the pointer. */
function Trend({ series, months, active, onActive, label }: { series: readonly number[]; months: readonly string[]; active: number; onActive: (index: number | null) => void; label: string }) {
  const gradient = useId();
  const low = Math.min(...series);
  const high = Math.max(...series);
  const pad = (high - low || 1) * 0.18;
  const last = series.length - 1;
  const points = series.map((value, index): [number, number] => [(index / last) * 100, 36 - ((value - (low - pad)) / (high + pad - (low - pad))) * 32]);
  const line = curve(points);
  const [x, y] = points[active];

  const move = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    onActive(Math.min(last, Math.max(0, Math.round(((event.clientX - box.left) / box.width) * last))));
  };

  return (
    <div className={styles.chart} onPointerMove={move} onPointerLeave={() => onActive(null)} role="img" aria-label={`${label} by month, ${months[0]} to ${months[last]}`}>
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--c-500)" stopOpacity="0.22" />
            <stop offset="1" stopColor="var(--c-500)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${line} L100,40 L0,40 Z`} fill={`url(#${gradient})`} />
        <path d={line} className={styles.line} />
      </svg>
      <i className={styles.guide} style={{ left: `${x}%` }} />
      <i className={styles.dot} style={{ left: `${x}%`, top: `${(y / 40) * 100}%` }} />
    </div>
  );
}

function MetricCard({ metric, months, index }: { metric: Metric; months: readonly string[]; index: number }) {
  const { label, icon: Icon, tone, series, format, unit, rest, perMonth, change } = metric;
  const [hover, setHover] = useState<number | null>(null);
  // The figure counts up once on load; after the pointer has been over the chart it just shows values.
  const [touched, setTouched] = useState(false);
  const active = hover ?? series.length - 1;

  const figure = hover === null ? rest.figure : format(series[hover]);
  const caption = hover === null ? rest.caption : `${months[hover]} · ${perMonth}`;

  return (
    <Card className={styles.kpi} data-tone={tone} style={{ "--i": index } as CSSProperties}>
      <div className={styles.top}>
        <span className={styles.label}>
          <Icon aria-hidden />
          {label}
        </span>
        <Delta value={change.value} direction={change.direction} variant="chip" />
      </div>
      <p className={styles.figure}>
        {touched ? figure : <CountUp value={figure} />}
        {unit && <small>{unit}</small>}
      </p>
      <p className={styles.caption}>{caption}</p>
      <Trend
        series={series}
        months={months}
        active={active}
        label={label}
        onActive={(next) => {
          if (next !== null) setTouched(true);
          setHover(next);
        }}
      />
    </Card>
  );
}

/** The four Reports KPIs: calm white cards, one figure each and a line that fills the card. Hover the line to read any month. */
export function ReportKpis({ months, visits, collected, wait, satisfaction, visitsChange, revenueChange }: Props) {
  const length = months.length;
  const since = `since ${months[0]}`;
  const total = (values: readonly number[]) => values.reduce((sum, value) => sum + value, 0);

  const metrics: Metric[] = [
    {
      id: "visits",
      label: "Patient visits",
      icon: LuCalendarCheck,
      tone: "primary",
      series: visits,
      format: count,
      rest: { figure: count(total(visits)), caption: `${since}, ${count(visits[length - 1])} in ${months[length - 1]}` },
      perMonth: "visits",
      change: { value: visitsChange },
    },
    {
      id: "revenue",
      label: "Revenue collected",
      icon: LuWallet,
      tone: "blue",
      series: collected,
      format: thousands,
      rest: { figure: thousands(total(collected)), caption: `${since}, ${thousands(collected[length - 1])} in ${months[length - 1]}` },
      perMonth: "collected",
      change: { value: revenueChange },
    },
    {
      id: "wait",
      label: "Average wait",
      icon: LuClock3,
      tone: "amber",
      series: wait,
      format: (value) => String(value),
      unit: "min",
      rest: { figure: String(wait[length - 1]), caption: `Down from ${wait[0]} min ${since}` },
      perMonth: "average wait",
      change: { value: `${wait[0] - wait[length - 1]} min`, direction: "down" },
    },
    {
      id: "satisfaction",
      label: "Satisfaction",
      icon: LuSmile,
      tone: "violet",
      series: satisfaction,
      format: (value) => `${value}%`,
      rest: { figure: `${satisfaction[length - 1]}%`, caption: `Up from ${satisfaction[0]}% ${since}` },
      perMonth: "satisfied",
      change: { value: `${satisfaction[length - 1] - satisfaction[0]} pts` },
    },
  ];

  return (
    <div className={styles.grid}>
      {metrics.map((metric, index) => (
        <MetricCard key={metric.id} metric={metric} months={months} index={index} />
      ))}
    </div>
  );
}
