import { useId } from "react";
import { palette } from "@/lib/tokens";
import type { HyperColor } from "./hyper";
import styles from "./hyper.module.css";

const WIDTH = 300;
const HEIGHT = 100;

/** Smooth curve through the points (Catmull-Rom converted to cubic Béziers), kept inside the plot so it never overshoots. */
function curve(points: readonly (readonly [number, number])[]) {
  const [first, ...rest] = points;
  let path = `M${first[0]},${first[1]}`;
  rest.forEach((point, index) => {
    const before = points[Math.max(index - 1, 0)];
    const start = points[index];
    const after = points[Math.min(index + 2, points.length - 1)];
    const c1: [number, number] = [start[0] + (point[0] - before[0]) / 6, start[1] + (point[1] - before[1]) / 6];
    const c2: [number, number] = [point[0] - (after[0] - start[0]) / 6, point[1] - (after[1] - start[1]) / 6];
    const clamp = (y: number) => Math.min(Math.max(y, 0), HEIGHT);
    path += ` C${c1[0]},${clamp(c1[1])} ${c2[0]},${clamp(c2[1])} ${point[0]},${point[1]}`;
  });
  return path;
}

/**
 * Soft line chart at widget size (light theme): a smooth line, a faint wash of the same tone beneath
 * it and faint guide lines. Stays calm on purpose: the line uses the 400 step of the tone, the wash the 100–300 steps.
 * Scaled between the lowest and highest value so small movements stay visible.
 */
export function HyperSparkLine({
  data,
  tone,
  name,
  height = 64,
}: Pick<HyperColor, "tone"> & { data: readonly number[]; name: string; height?: number }) {
  const id = useId();
  const scale = palette[tone];
  const smooth = data;
  const low = Math.min(...smooth);
  const range = Math.max(...smooth) - low || 1;
  const points = smooth.map((value, index) => {
    const x = (index / Math.max(smooth.length - 1, 1)) * WIDTH;
    // Keep the line between 10% and 88% of the height: room for the stroke on top, wash underneath.
    const y = HEIGHT * (0.88 - ((value - low) / range) * 0.78);
    return [x, y] as const;
  });
  const line = curve(points);
  const area = `${line} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`;

  return (
    <div className={styles.sparkLine} role="img" aria-label={`${name}: ${data.join(", ")}`} style={{ height }}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id={`${id}-wash`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={scale[300]} stopOpacity="0.16" />
            <stop offset="100%" stopColor={scale[100]} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.18, 0.5, 0.82].map((position) => (
          <line
            key={position}
            x1="0"
            x2={WIDTH}
            y1={HEIGHT * position}
            y2={HEIGHT * position}
            className={styles.sparkGuide}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path d={area} fill={`url(#${id}-wash)`} />
        <path d={line} className={styles.sparkStroke} stroke={scale[400]} vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
