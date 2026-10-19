import type { IconType } from "react-icons";
import { HyperSparkLine } from "@/components/charts/hyper-spark-line";
import { Card } from "./card";
import { CountUp } from "./count-up";
import { Delta } from "./delta";
import { ToneTile, type Tone } from "./tone-tile";

export type StatTileProps = {
  label: string;
  value: number | string;
  /** Change since the last period, e.g. "12%" or "2". Leave out (with `period`) for a plain count. */
  change?: string;
  period?: string;
  icon: IconType;
  tone: Tone;
  /** `danger` colours the change red (e.g. "at risk" going up is bad news). */
  deltaTone?: "success" | "danger";
  /** Gives the tile a tinted accent so it reads as the priority figure. */
  featured?: boolean;
  /** Recent values as a soft line chart under the figure. */
  trend?: readonly number[];
  /** Counts the figure up from zero on mount (on by default; pass `countUp={false}` for a static figure) (a formatted string such as "1,248" or "$16,073"). */
  countUp?: boolean;
};

/**
 * KPI tile: label and tinted icon on top, the figure, then the change against the last period.
 * With `trend` a soft line chart closes the tile; without it a hairline separates the change.
 */
export function StatTile({
  label,
  value,
  change,
  period,
  icon: Icon,
  tone,
  deltaTone = "success",
  featured = false,
  trend,
  countUp = true,
}: StatTileProps) {
  const figure = countUp ? <CountUp value={String(value)} /> : value;

  return (
    <Card
      className={trend ? "stat-tile stat-tile-chart" : "stat-tile"}
      data-tone={trend || featured ? tone : undefined}
      data-featured={featured || undefined}
    >
      <div className="stat-tile-top">
        <p className="text-label text-muted">{label}</p>
        <ToneTile tone={tone} size={32}>
          <Icon />
        </ToneTile>
      </div>
      <p className="stat-tile-figure" data-animated={countUp || undefined}>{figure}</p>
      {(change || period) && (
        <p className="stat-tile-meta">
          {change && <Delta value={change} tone={deltaTone} variant="chip" />}
          {period && <span className="text-small text-muted">{period}</span>}
        </p>
      )}
      {trend && <HyperSparkLine name={label} data={trend} tone={tone} />}
    </Card>
  );
}

/** Four-tile summaries use 4, 2, then 1 column as the content area narrows. */
export function StatGrid({ children }: { children: React.ReactNode }) {
  return <div className="stat-grid">{children}</div>;
}
