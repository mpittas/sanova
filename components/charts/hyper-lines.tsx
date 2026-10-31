"use client";

import { useId, useState, type CSSProperties, type PointerEvent } from "react";
import { LINE_GUIDES, LINE_WASH_OPACITY, lineColor, smoothPath, type HyperColor } from "./hyper";
import styles from "./hyper.module.css";

export type LineSeries = Pick<HyperColor, "tone"> & { name: string; data: readonly number[]; soft?: boolean };

const WIDTH = 300;
const HEIGHT = 100;

/**
 * Two or three smooth lines on a white plot with three hairline guides and no value axis. Hovering shows a guide,
 * a dot per line and the exact figures. Plain SVG for the lines, HTML for the dots and tooltip.
 */
export function HyperLines({
  categories,
  series,
  height = 220,
  label,
}: {
  categories: readonly string[];
  series: readonly LineSeries[];
  height?: number;
  label: string;
}) {
  const id = useId();
  const [active, setActive] = useState<number | null>(null);
  const last = Math.max(categories.length - 1, 1);
  const ceiling = Math.max(...series.flatMap(({ data }) => data)) * 1.12;
  const x = (index: number) => (index / last) * WIDTH;
  const y = (value: number) => HEIGHT - (value / ceiling) * HEIGHT * 0.94 - 3;
  const colour = (line: LineSeries) => lineColor(line);

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - box.left) / box.width;
    setActive(Math.min(Math.max(Math.round(ratio * last), 0), last));
  };

  return (
    <div className={styles.lines} style={{ "--plot-height": `${height}px` } as CSSProperties}>
      <div
        className={styles.linesPlot}
        role="img"
        aria-label={label}
        onPointerMove={onMove}
        onPointerLeave={() => setActive(null)}
      >
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" aria-hidden>
          <defs>
            {series.map((line, index) => (
              <linearGradient key={line.name} id={`${id}-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colour(line)} stopOpacity={LINE_WASH_OPACITY} />
                <stop offset="100%" stopColor={colour(line)} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
          {LINE_GUIDES.map((position) => (
            <line
              key={position}
              x1="0"
              x2={WIDTH}
              y1={HEIGHT * position}
              y2={HEIGHT * position}
              className={styles.linesGuide}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {series.map((line, index) => {
            const points = line.data.map((value, i) => [x(i), y(value)] as const);
            const path = smoothPath(points, HEIGHT);
            return (
              <g key={line.name}>
                <path d={`${path} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`} fill={`url(#${id}-${index})`} />
                <path d={path} className={styles.linesStroke} stroke={colour(line)} vectorEffect="non-scaling-stroke" />
              </g>
            );
          })}
        </svg>

        {active !== null && (
          <>
            <span className={styles.linesCursor} style={{ left: `${(active / last) * 100}%` }} aria-hidden />
            {series.map((line) => (
              <span
                key={line.name}
                className={styles.linesDot}
                style={{
                  left: `${(active / last) * 100}%`,
                  top: `${(y(line.data[active]) / HEIGHT) * 100}%`,
                  borderColor: colour(line),
                }}
                aria-hidden
              />
            ))}
            <div
              className={styles.linesTip}
              style={{ left: `min(max(${(active / last) * 100}%, 72px), calc(100% - 72px))` }}
              role="status"
            >
              <p className="text-label">{categories[active]}</p>
              {series.map((line) => (
                <p key={line.name} className={`${styles.tipRow} text-small`}>
                  <span className={styles.tipDot} style={{ background: colour(line) }} />
                  <span className="text-muted">{line.name}</span>
                  <span className="text-label num">{line.data[active]}</span>
                </p>
              ))}
            </div>
          </>
        )}
      </div>

      <div className={styles.linesCategories} aria-hidden>
        {categories.map((category) => (
          <span key={category} className="text-small">
            {category}
          </span>
        ))}
      </div>
    </div>
  );
}
