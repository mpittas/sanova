"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { hyperGradient, niceStep, type HyperColor } from "./hyper";
import styles from "./hyper.module.css";

export type HyperSeries = HyperColor & { name: string; data: readonly number[] };

/**
 * Hyper "stacked columns" chart (light theme): rounded gradient pills stacked per category, or
 * placed side by side with `mode="grouped"`. Plain HTML/CSS, so it scales with its container.
 */
export function HyperColumns({
  categories,
  series,
  mode = "stacked",
  ticks = 4,
  height = 240,
  minimal = false,
  label,
}: {
  categories: readonly string[];
  series: readonly HyperSeries[];
  mode?: "stacked" | "grouped";
  ticks?: number;
  height?: number;
  /** Drops the value axis and grid lines, leaving only a baseline. The tooltip still shows exact values. */
  minimal?: boolean;
  /** Accessible description of the chart. */
  label: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  // Bars grow from zero on first paint; later data changes animate between heights.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const totals = categories.map((_, index) => series.reduce((sum, { data }) => sum + data[index], 0));
  const peak = mode === "stacked" ? Math.max(...totals) : Math.max(...series.flatMap(({ data }) => data));
  const step = niceStep(peak / ticks);
  const axisMax = step * ticks;
  const axis = Array.from({ length: ticks + 1 }, (_, index) => step * index);
  const percent = (value: number) => `${ready ? (value / axisMax) * 100 : 0}%`;

  return (
    <div className={styles.columns} data-minimal={minimal || undefined} style={{ "--plot-height": `${height}px` } as CSSProperties}>
      {!minimal && (
        <div className={styles.axis} aria-hidden>
          {[...axis].reverse().map((value) => (
            <span key={value} className="text-small num">
              {value}
            </span>
          ))}
        </div>
      )}
      <div className={styles.plot} role="img" aria-label={label} onMouseLeave={() => setActive(null)}>
        <div className={styles.grid} aria-hidden>
          {axis.map((value) => (
            <span key={value} />
          ))}
        </div>
        <div className={styles.cols}>
          {categories.map((category, index) => (
            <div
              key={category}
              className={[styles.col, active === index && styles.colActive].filter(Boolean).join(" ")}
              tabIndex={0}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
            >
              <div className={mode === "stacked" ? styles.stack : styles.group}>
                {series.map(({ name, data, tone, soft }) => (
                  <span
                    key={name}
                    className={styles.pill}
                    style={{ height: percent(data[index]), background: hyperGradient({ tone, soft }) }}
                  />
                ))}
              </div>
              <span className={`${styles.category} text-small`}>
                <span className={styles.categoryFull}>{category}</span>
                <span className={styles.categoryShort} aria-hidden>
                  {category.slice(0, 1)}
                </span>
              </span>
              {active === index && (
                <div
                  className={[
                    styles.tip,
                    index < 2 && styles.tipStart,
                    index > categories.length - 3 && styles.tipEnd,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  role="status"
                >
                  <p className="text-label">{category}</p>
                  {series.map(({ name, data, tone, soft }) => (
                    <p key={name} className={`${styles.tipRow} text-small`}>
                      <span className={styles.tipDot} style={{ background: hyperGradient({ tone, soft }) }} />
                      <span className="text-muted">{name}</span>
                      <span className="text-label num">{data[index]}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
