import { Easing } from "remotion";

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const soft = Easing.bezier(0.33, 1, 0.68, 1);

/** Eased 0 to 1 progress of `frame` between `start` and `start + dur`. */
export const prog = (frame: number, start: number, dur: number, ease: (t: number) => number = easeOut) => ease(clamp01((frame - start) / dur));

/** Smooth open path through the points (Catmull-Rom as cubic Béziers). */
export function curve(points: readonly (readonly [number, number])[]) {
  const [first, ...rest] = points;
  let d = `M${first[0]},${first[1]}`;
  rest.forEach((pt, i) => {
    const before = points[Math.max(i - 1, 0)];
    const start = points[i];
    const after = points[Math.min(i + 2, points.length - 1)];
    d += ` C${start[0] + (pt[0] - before[0]) / 6},${start[1] + (pt[1] - before[1]) / 6} ${pt[0] - (after[0] - start[0]) / 6},${pt[1] - (after[1] - start[1]) / 6} ${pt[0]},${pt[1]}`;
  });
  return d;
}

/** Counts a formatted number ("$16,073", "9.3%", "1,248") up from zero. */
export function countUp(value: string, p: number) {
  const m = value.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!m) return value;
  const decimals = m[2].includes(".") ? m[2].split(".")[1].length : 0;
  const n = Number(m[2].replace(/,/g, "")) * p;
  return `${m[1]}${n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${m[3]}`;
}
