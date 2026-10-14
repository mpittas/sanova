/**
 * Sanova design tokens — the single source of truth.
 *
 * `buildThemeCss()` turns these into CSS custom properties and type classes
 * (injected by <ThemeStyle />), the /docs page renders them, and charts read
 * hex values straight from `palette`.
 */

const steps = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"] as const;
export type Step = (typeof steps)[number];
export type Scale = Record<Step, string>;

export const palette = {
  // Brand: a deep medical green. 500 is dark enough for white text (4.6:1), so it works as a button fill.
  primary: {
    "50": "#EDF9F3",
    "100": "#D5F1E3",
    "200": "#AEE3C9",
    "300": "#7BCFAA",
    "400": "#3FB583",
    "500": "#0B865A",
    "600": "#086E49",
    "700": "#07583B",
    "800": "#084630",
    "900": "#093928",
  },
  // Informational / neutral-positive accents (the old brand blue): "Upcoming", "In Person", scheduled items.
  blue: {
    "50": "#EFF5FF",
    "100": "#DEE9FF",
    "200": "#BFD4FF",
    "300": "#92B3FF",
    "400": "#5F8CFF",
    "500": "#2F6BF2",
    "600": "#2255D6",
    "700": "#1C44AC",
    "800": "#1B3A88",
    "900": "#1B3369",
  },
  success: {
    "50": "#ECFDF5",
    "100": "#D1FAE5",
    "200": "#A7F3D0",
    "300": "#6EE7B7",
    "400": "#34D399",
    "500": "#10B981",
    "600": "#059669",
    "700": "#047857",
    "800": "#065F46",
    "900": "#064E3B",
  },
  violet: {
    "50": "#F5F3FF",
    "100": "#EDE9FE",
    "200": "#DDD6FE",
    "300": "#C4B5FD",
    "400": "#A78BFA",
    "500": "#8B5CF6",
    "600": "#7C3AED",
    "700": "#6D28D9",
    "800": "#5B21B6",
    "900": "#4C1D95",
  },
  coral: {
    "50": "#FFF3EF",
    "100": "#FFE3DB",
    "200": "#FFC8B8",
    "300": "#FFA48B",
    "400": "#FA7C5E",
    "500": "#F0583A",
    "600": "#DB3F20",
    "700": "#B6311A",
    "800": "#922B1B",
    "900": "#782819",
  },
  amber: {
    "50": "#FFFBEB",
    "100": "#FEF3C7",
    "200": "#FDE68A",
    "300": "#FCD34D",
    "400": "#FBBF24",
    "500": "#F59E0B",
    "600": "#D97706",
    "700": "#B45309",
    "800": "#92400E",
    "900": "#78350F",
  },
  teal: {
    "50": "#F0FDFA",
    "100": "#CCFBF1",
    "200": "#99F6E4",
    "300": "#5EEAD4",
    "400": "#2DD4BF",
    "500": "#14B8A6",
    "600": "#0D9488",
    "700": "#0F766E",
    "800": "#115E59",
    "900": "#134E4A",
  },
  neutral: {
    "50": "#F3F6FB",
    "100": "#EAEFF7",
    "200": "#DCE3EE",
    "300": "#C3CDDC",
    "400": "#94A3B8",
    "500": "#64748B",
    "600": "#475569",
    "700": "#334155",
    "800": "#1E293B",
    "900": "#0F172A",
  },
} as const satisfies Record<string, Scale>;

export type PaletteName = keyof typeof palette;

export const paletteMeta: Record<PaletteName, { label: string; usage: string }> = {
  primary: { label: "Primary", usage: "Brand, primary actions, links, active states" },
  blue: { label: "Blue", usage: "Informational states: upcoming, scheduled, in-person" },
  success: { label: "Success", usage: "Positive trends, confirmations, completed" },
  violet: { label: "Violet", usage: "Secondary accent, doctors, records" },
  coral: { label: "Coral", usage: "Alerts, destructive actions, revenue" },
  amber: { label: "Amber", usage: "Warnings and highlights" },
  teal: { label: "Teal", usage: "Logo accent, supporting highlights" },
  neutral: { label: "Neutral", usage: "Text, borders, backgrounds" },
};

/** Semantic aliases used by components. */
export const semantic = [
  { name: "bg", value: "#F5F7FB", usage: "Page background" },
  { name: "panel", value: "#F9FBFE", usage: "Large app shell / panel background" },
  { name: "surface", value: "#FFFFFF", usage: "Cards and inputs" },
  { name: "border", value: "#E6ECF5", usage: "Hairlines and dividers" },
  { name: "text", value: "#0F172A", usage: "Primary text" },
  { name: "text-muted", value: "#64748B", usage: "Secondary text" },
  { name: "text-subtle", value: "#94A3B8", usage: "Hints, axis labels, placeholders" },
] as const;

/** Typography scale — emitted as `.text-<name>` classes. */
export const typeScale = [
  { name: "display", size: 48, lineHeight: 1.05, weight: 400, tracking: "-0.02em", usage: "Welcome headline" },
  { name: "h1", size: 34, lineHeight: 1.15, weight: 500, tracking: "-0.015em", usage: "Page titles" },
  { name: "h2", size: 28, lineHeight: 1.2, weight: 500, tracking: "-0.01em", usage: "Section titles" },
  { name: "h3", size: 23, lineHeight: 1.25, weight: 500, tracking: "-0.005em", usage: "Sub-sections" },
  { name: "h4", size: 18, lineHeight: 1.3, weight: 500, tracking: "0", usage: "Card titles" },
  { name: "stat", size: 30, lineHeight: 1.1, weight: 700, tracking: "-0.02em", usage: "KPI numbers" },
  { name: "lead", size: 26, lineHeight: 1.2, weight: 400, tracking: "-0.01em", usage: "Intro / subtitle text" },
  { name: "body-lg", size: 16, lineHeight: 1.5, weight: 400, tracking: "0", usage: "Long-form text" },
  { name: "body", size: 14, lineHeight: 1.5, weight: 400, tracking: "0", usage: "Default text" },
  { name: "label", size: 14, lineHeight: 1.4, weight: 500, tracking: "0", usage: "Names, form labels, buttons" },
  { name: "small", size: 13, lineHeight: 1.4, weight: 400, tracking: "0", usage: "Secondary information" },
  { name: "caption", size: 12, lineHeight: 1.35, weight: 500, tracking: "0.01em", usage: "Axis labels, footnotes" },
] as const;

// ---------------------------------------------------------------------------------------------
// Colour maths, used by the /docs usage guide so the numbers shown there are always real.
// ---------------------------------------------------------------------------------------------

const channels = (hex: string) => [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16));
const linear = (value: number) => {
  const channel = value / 255;
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
};

/** WCAG relative luminance. */
function luminance(hex: string) {
  const [r, g, b] = channels(hex).map(linear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two hex colours (1–21). Text needs 4.5, large text and UI shapes 3. */
export function contrastRatio(a: string, b: string) {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Perceptual lightness (OKLab L, 0 = black, 1 = white). Steps that differ by ~0.07+ read as clearly different. */
export function lightness(hex: string) {
  const [r, g, b] = channels(hex).map(linear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
}

export function buildThemeCss(): string {
  const vars: string[] = [];

  for (const [name, scale] of Object.entries(palette)) {
    for (const step of steps) vars.push(`--color-${name}-${step}:${scale[step]};`);
  }
  for (const token of semantic) vars.push(`--color-${token.name}:${token.value};`);

  const typeClasses = typeScale
    .map(
      (t) =>
        `.text-${t.name}{font-size:${t.size / 16}rem;line-height:${t.lineHeight};font-weight:${t.weight};letter-spacing:${t.tracking};}`,
    )
    .join("");

  return `:root{${vars.join("")}}${typeClasses}`;
}
