import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { ToneTile, type Tone } from "./tone-tile";

type InfoTileProps = {
  label: string;
  value: ReactNode;
  /** `metric` (default): a big number over what it counts. `fact`: a value in regular type over its label. */
  variant?: "metric" | "fact";
} & (
  | { icon: IconType; tone: Tone; leading?: undefined }
  /** An avatar (or any element) instead of a tinted icon. */
  | { leading: ReactNode; icon?: undefined; tone?: undefined }
);

/** Compact tile for use inside a card: a tinted icon, a value and its label. For a page-level KPI use `StatTile`. */
export function InfoTile({ label, value, variant = "metric", icon: Icon, tone, leading }: InfoTileProps) {
  return (
    <div className="info-tile">
      {leading ??
        (Icon && tone && (
          <ToneTile tone={tone} size={variant === "metric" ? 44 : 40}>
            <Icon />
          </ToneTile>
        ))}
      <div className="info-tile-text">
        <dd className={variant === "metric" ? "text-h3 num" : "text-label"}>{value}</dd>
        <dt className="text-small text-muted">{label}</dt>
      </div>
    </div>
  );
}

/** Grid of `InfoTile`s. By default as many columns as fit (never narrower than 150px); pass `columns` for a fixed count (it falls back to the automatic layout on narrow screens). */
export function InfoGrid({ children, columns, ...rest }: { children: ReactNode; columns?: 2 | 3; "aria-label"?: string }) {
  return (
    <dl className="info-grid" data-columns={columns} {...rest}>
      {children}
    </dl>
  );
}
