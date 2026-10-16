import type { CSSProperties, ReactNode } from "react";
import { hyperStops, type HyperColor } from "./hyper";
import styles from "./hyper.module.css";

export type HyperBarRow = HyperColor & {
  label: string;
  /** Share of the full bar, 0–100. */
  share: number;
  detail?: ReactNode;
  value?: ReactNode;
};

const SEGMENTS = 20;

/** Hyper "stacked horizontal bar" (light theme): each row is a track of rounded segments filled in a gradient. */
export function HyperBars({ rows, label }: { rows: readonly HyperBarRow[]; label: string }) {
  return (
    <ul className={styles.rows} aria-label={label}>
      {rows.map(({ label: name, share, tone, soft, detail, value }) => {
        const [from, to] = hyperStops({ tone, soft });
        const filled = Math.max(share > 0 ? 1 : 0, Math.round((share / 100) * SEGMENTS));
        return (
          <li key={name} className={styles.row}>
            <div className={styles.rowHead}>
              <span className="text-small">{name}</span>
              {detail !== undefined && <span className="text-small text-muted num">{detail}</span>}
              {value !== undefined && <span className={`${styles.rowValue} text-label num`}>{value}</span>}
            </div>
            <div
              className={styles.track}
              role="img"
              aria-label={`${name}: ${share}%`}
              style={{ "--from": from, "--to": to } as CSSProperties}
            >
              {Array.from({ length: SEGMENTS }, (_, index) => (
                <span
                  key={index}
                  className={index < filled ? styles.segOn : styles.seg}
                  style={
                    index < filled
                      ? { background: `color-mix(in srgb, var(--from), var(--to) ${(index / Math.max(filled - 1, 1)) * 100}%)` }
                      : undefined
                  }
                />
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
