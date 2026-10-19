"use client";

import { useId, useState, type CSSProperties, type PointerEvent } from "react";
import { palette } from "@/lib/tokens";
import type { HyperColor } from "./hyper";
import styles from "./hyper.module.css";

export type LineSeries = Pick<HyperColor, "tone"> & { name: string; data: readonly number[]; soft?: boolean };

const WIDTH = 300;
const HEIGHT = 100;

/** Smooth curve through the points (Catmull-Rom as cubic Béziers), kept inside the plot so it never overshoots. */
function curve(points: readonly (readonly [number, number])[]) {
  const [first, ...rest] = points;
  let path = `M${first[0]},${first[1]}`;
  rest.forEach((point, index) => {
    const before = points[Math.max(index - 1, 0)];
    const start = points[index];
    const after = points[Math.min(index + 2, points.length - 1)];
    const clamp = (y: number) => Math.min(Math.max(y, 0), HEIGHT);
    const c1: [number, number] = [start[0] + (point[0] - before[0]) / 6, clamp(start[1] + (point[1] - before[1]) / 6)];
    const c2: [number, number] = [point[0] - (after[0] - start[0]) / 6, clamp(point[1] - (after[1] - start[1]) / 6)];
    path += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${point[0]},${point[1]}`;
  });
  return path;
}

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
  const colour = ({ tone, soft }: LineSeries) => palette[tone][soft ? 300 : 500];

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
                <stop offset="0%" stopColor={colour(line)} stopOpacity={line.soft ? 0.1 : 0.16} />
                <stop offset="100%" stopColor={colour(line)} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
          {[0.25, 0.5, 0.75].map((position) => (
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
            const path = curve(points);
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
