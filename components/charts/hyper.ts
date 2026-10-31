import type { Tone } from "@/components/ui/tone-tile";
import { palette } from "@/lib/tokens";

/** A palette tone, or `neutral` for "everything else". `soft` is the lighter shade of the same tone. */
export type HyperColor = { tone: Tone | "neutral"; soft?: boolean };

/** The Hyper chart look (light theme): every mark is a soft two-stop gradient of one palette tone. */
export function hyperStops({ tone, soft }: HyperColor) {
  const scale = palette[tone];
  return soft ? ([scale[300], scale[200]] as const) : ([scale[500], scale[300]] as const);
}

export function hyperGradient(color: HyperColor, direction = "to top") {
  const [from, to] = hyperStops(color);
  return `linear-gradient(${direction}, ${from}, ${to})`;
}

// ---------------------------------------------------------------------------------------------
// Line charts (trends and stat-tile sparklines) share one look, so they are defined once here.
// ---------------------------------------------------------------------------------------------

/** Stroke colour of a line: the 500 step of its tone, or the 300 step for the quieter second series. */
export const lineColor = ({ tone, soft }: HyperColor) => palette[tone][soft ? 300 : 500];

/** The wash under every line fades from this opacity to nothing, in the line's own colour. */
export const LINE_WASH_OPACITY = 0.16;

/** Dashed hairline guides, as fractions of the plot height. */
export const LINE_GUIDES = [0.25, 0.5, 0.75] as const;

/** Smooth curve through the points (Catmull-Rom as cubic Béziers), kept inside the plot so it never overshoots. */
export function smoothPath(points: readonly (readonly [number, number])[], height: number) {
  const [first, ...rest] = points;
  const clamp = (y: number) => Math.min(Math.max(y, 0), height);
  let path = `M${first[0]},${first[1]}`;
  rest.forEach((point, index) => {
    const before = points[Math.max(index - 1, 0)];
    const start = points[index];
    const after = points[Math.min(index + 2, points.length - 1)];
    const c1 = [start[0] + (point[0] - before[0]) / 6, clamp(start[1] + (point[1] - before[1]) / 6)];
    const c2 = [point[0] - (after[0] - start[0]) / 6, clamp(point[1] - (after[1] - start[1]) / 6)];
    path += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${point[0]},${point[1]}`;
  });
  return path;
}

/** Rounds an axis step up to the next tidy number (1, 2, 2.5, 4, 5, 8, 10 × 10ⁿ), keeping the axis close to the data. */
export function niceStep(raw: number) {
  const power = 10 ** Math.floor(Math.log10(raw || 1));
  const fraction = raw / power;
  return (([1, 2, 2.5, 4, 5, 8, 10].find((step) => fraction <= step) ?? 10) * power);
}
