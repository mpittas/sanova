import type { IconType } from "react-icons";
import { LuArrowUp } from "react-icons/lu";
import { Card } from "./card";
import { ToneTile, type Tone } from "./tone-tile";

export type StatTileProps = {
  label: string;
  value: number | string;
  /** Change since the last period, e.g. "12%" or "2". */
  change: string;
  period: string;
  icon: IconType;
  tone: Tone;
  /** `danger` colours the change red (e.g. "at risk" going up is bad news). */
  deltaTone?: "success" | "danger";
};

/** KPI tile: tinted icon, label, big number and a change indicator. */
export function StatTile({ label, value, change, period, icon: Icon, tone, deltaTone = "success" }: StatTileProps) {
  return (
    <Card className="stat-tile">
      <ToneTile tone={tone} size={52}>
        <Icon />
      </ToneTile>
      <div className="stat-tile-body">
        <p className="text-label text-muted">{label}</p>
        <div className="stat-tile-line">
          <span className="text-stat num">{value}</span>
          <span className="stat-delta" data-tone={deltaTone}>
            <LuArrowUp aria-hidden />
            <span className="sr-only">Up </span>
            {change}
          </span>
        </div>
        <p className="text-small text-muted">{period}</p>
      </div>
    </Card>
  );
}

/** Responsive row of stat tiles: 4 across on wide screens, wrapping down to 1. */
export function StatGrid({ children }: { children: React.ReactNode }) {
  return <div className="stat-grid">{children}</div>;
}
