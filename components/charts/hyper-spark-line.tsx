import { useId } from "react";
import { LINE_GUIDES, LINE_WASH_OPACITY, lineColor, smoothPath, type HyperColor } from "./hyper";
import styles from "./hyper.module.css";

const WIDTH = 300;
const HEIGHT = 100;

/**
 * Soft line chart at widget size (light theme): a smooth line, a faint wash of the same tone beneath
 * it and faint guide lines. Stays calm on purpose: it shares colour, wash and guides with `HyperLines` (see hyper.ts).
 * Scaled between the lowest and highest value so small movements stay visible.
 */
export function HyperSparkLine({
  data,
  tone,
  name,
  height = 64,
}: Pick<HyperColor, "tone"> & { data: readonly number[]; name: string; height?: number }) {
  const id = useId();
  const color = lineColor({ tone });
  const smooth = data;
  const low = Math.min(...smooth);
  const range = Math.max(...smooth) - low || 1;
  const points = smooth.map((value, index) => {
    const x = (index / Math.max(smooth.length - 1, 1)) * WIDTH;
    // Keep the line between 10% and 88% of the height: room for the stroke on top, wash underneath.
    const y = HEIGHT * (0.88 - ((value - low) / range) * 0.78);
    return [x, y] as const;
  });
  const line = smoothPath(points, HEIGHT);
  const area = `${line} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`;

  return (
    <div className={styles.sparkLine} role="img" aria-label={`${name}: ${data.join(", ")}`} style={{ height }}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id={`${id}-wash`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={LINE_WASH_OPACITY} />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {LINE_GUIDES.map((position) => (
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
        <path d={line} className={styles.sparkStroke} stroke={color} vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
