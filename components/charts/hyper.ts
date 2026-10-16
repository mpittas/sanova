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

/** Rounds an axis step up to the next tidy number (1, 2, 2.5, 4, 5, 8, 10 × 10ⁿ), keeping the axis close to the data. */
export function niceStep(raw: number) {
  const power = 10 ** Math.floor(Math.log10(raw || 1));
  const fraction = raw / power;
  return (([1, 2, 2.5, 4, 5, 8, 10].find((step) => fraction <= step) ?? 10) * power);
}
