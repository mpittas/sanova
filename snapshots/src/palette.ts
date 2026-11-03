/** Hue (0-360) of a #rrggbb colour. */
export function hueOf(hex: string) {
  const value = hex.replace("#", "");
  const full = value.length === 3 ? value.split("").map((c) => c + c).join("") : value;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return 220;
  let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h *= 60;
  return h < 0 ? h + 360 : h;
}

/**
 * Near-neutral colours with the faintest tint of the design's accent: related to the design, never competing with it.
 * Without an accent everything is neutral gray.
 */
export function palette(accent?: string) {
  const h = accent ? Math.round(hueOf(accent)) : 220;
  const s = (value: number) => (accent ? value : 2);
  return {
    bgA: `hsl(${h} ${s(9)}% 99.2%)`,
    bgB: `hsl(${h} ${s(8)}% 95.6%)`,
    bgC: `hsl(${h} ${s(9)}% 91.6%)`,
    dot: `hsl(${h} ${s(14)}% 28% / .24)`,
    frameA: `hsl(${h} ${s(7)}% 86.5%)`,
    frameB: `hsl(${h} ${s(7)}% 82%)`,
    hairline: `hsl(${h} 20% 20% / .07)`,
    shadowSoft: `hsl(${h} 24% 20% / .2)`,
    shadowTight: `hsl(${h} 24% 20% / .1)`,
  };
}
