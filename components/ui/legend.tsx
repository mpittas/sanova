import type { CSSProperties, ReactNode } from "react";

/** Chart legend. `column` lists items with their values; `row` is a compact inline key. */
export function Legend({
  direction = "column",
  className,
  children,
}: {
  direction?: "column" | "row";
  className?: string;
  children: ReactNode;
}) {
  const classes = ["legend", direction === "row" && "legend-row", className].filter(Boolean).join(" ");
  return <ul className={classes}>{children}</ul>;
}

export function LegendItem({
  color,
  label,
  detail,
  value,
}: {
  /** Any CSS colour, e.g. `var(--color-primary-500)`. */
  color: string;
  label: ReactNode;
  /** Muted secondary figure, e.g. a count. */
  detail?: ReactNode;
  /** Emphasised figure, e.g. a percentage. */
  value?: ReactNode;
}) {
  return (
    <li className="legend-item">
      <span className="legend-swatch" style={{ "--swatch": color } as CSSProperties} />
      <span className="text-small legend-label">{label}</span>
      {detail !== undefined && <span className="text-small text-muted num">{detail}</span>}
      {value !== undefined && <span className="text-label num legend-share">{value}</span>}
    </li>
  );
}
