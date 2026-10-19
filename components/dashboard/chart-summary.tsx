import type { ReactNode } from "react";
import { Delta } from "@/components/ui/delta";
import styles from "./dashboard.module.css";

/** Headline figure for a chart card: the number, what it counts and, optionally, how it moved. Shared by every chart on the dashboard. */
export function ChartSummary({ value, label, change }: { value: ReactNode; label: string; change?: string }) {
  return (
    <div>
      <p className={`text-h2 ${styles.chartFigure}`}>{value}</p>
      <p className={`${styles.summaryMeta} text-small text-muted`}>
        {label}
        {change && <Delta value={change} variant="chip" />}
      </p>
    </div>
  );
}
