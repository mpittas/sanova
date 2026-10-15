import type { IconType } from "react-icons";
import { Card } from "./card";
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
};

/** KPI tile: tinted icon, label, big number and a change indicator. */
export function StatTile({ label, value, change, period, icon: Icon, tone, deltaTone = "success", featured = false }: StatTileProps) {
  return (
    <Card className="stat-tile" data-tone={featured ? tone : undefined} data-featured={featured || undefined}>
      <ToneTile tone={tone} size={52}>
        <Icon />
      </ToneTile>
      <div className="stat-tile-body">
        <p className="text-label text-muted">{label}</p>
        <div className="stat-tile-line">
          <span className="text-stat num">{value}</span>
          {change && <Delta value={change} tone={deltaTone} />}
        </div>
        {period && <p className="text-small text-muted">{period}</p>}
      </div>
    </Card>
  );
}

/** Responsive row of stat tiles: 4 across on wide screens, wrapping down to 1. */
export function StatGrid({ children }: { children: React.ReactNode }) {
  return <div className="stat-grid">{children}</div>;
}
