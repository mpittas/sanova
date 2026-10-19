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
  // Brand: a fresh medical green, kept light on purpose. 500 carries white text on buttons at about 3.9:1, so keep button labels medium weight or heavier.
  primary: {
    "50": "#EDF9F3",
    "100": "#D5F1E3",
    "200": "#AEE3C9",
    "300": "#7BCFAA",
    "400": "#3FB583",
    "500": "#139A68",
    "600": "#0E8157",
    "700": "#0A6B49",
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
  { name: "white", value: "#FFFFFF", usage: "Text on solid brand and status fills, reversed logo" },
] as const;

/** Corner radii. `pill` is for fully rounded chips, counters and toggles. */
export const radius = {
  xs: "6px",
  sm: "8px",
  md: "10px",
  control: "12px",
  xl: "14px",
  lg: "16px",
  "2xl": "24px",
  pill: "999px",
} as const;

/** Spacing for gap, padding and margin. Named by pixel value: `--space-12` is 12px. */
export const space = {
  2: "2px",
  4: "4px",
  6: "6px",
  8: "8px",
  10: "10px",
  12: "12px",
  14: "14px",
  16: "16px",
  18: "18px",
  20: "20px",
  24: "24px",
  28: "28px",
  32: "32px",
  36: "36px",
  40: "40px",
  48: "48px",
  56: "56px",
} as const;

/** Text sizes for UI copy. The `.text-*` classes below use the larger type scale. */
export const fontSize = {
  "2xs": "0.625rem",
  xs: "0.6875rem",
  sm: "0.75rem",
  md: "0.8125rem",
  base: "0.875rem",
  lg: "0.9375rem",
} as const;

/** Fixed heights for buttons, fields and chips. */
export const controlSize = {
  xs: "26px",
  sm: "32px",
  chip: "36px",
  md: "44px",
  lg: "50px",
  xl: "52px",
} as const;

/** Icon sizes, set on the icon's own box. */
export const iconSize = {
  xs: "13px",
  sm: "14px",
  md: "16px",
  lg: "18px",
  xl: "20px",
  "2xl": "32px",
} as const;

/** Transition and animation durations. Use `base` unless there is a reason not to. */
export const duration = {
  instant: "0.1s",
  fast: "0.12s",
  base: "0.15s",
  medium: "0.2s",
  slow: "0.25s",
  slower: "0.4s",
  enter: "0.45s",
  spin: "0.7s",
} as const;

export const easing = {
  standard: "ease",
  out: "cubic-bezier(0.2, 0.7, 0.2, 1)",
  move: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

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

// ---------------------------------------------------------------------------------------------
// Elevation and overlays. Shadows tint their colour from the palette, so changing a brand
// colour changes every shadow that uses it.
// ---------------------------------------------------------------------------------------------

/** A hex colour at an alpha, as an `rgb()` string for shadows and overlays. */
function rgba(hex: string, alpha: number) {
  const [r, g, b] = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16));
  return `rgb(${r} ${g} ${b} / ${alpha})`;
}

const ink = palette.neutral["900"];
const brand = palette.primary["500"];
const coral = palette.coral["500"];
const highlight = "inset 0 1px 0 rgb(255 255 255 / 0.14)";

export const shadow = {
  /** Flat card and control edge */
  xs: `0 1px 2px ${rgba(ink, 0.03)}`,
  control: `0 1px 2px ${rgba(ink, 0.04)}`,
  card: `0 1px 2px ${rgba(ink, 0.03)}, 0 10px 30px ${rgba(brand, 0.05)}`,
  float: `0 2px 4px ${rgba(ink, 0.04)}, 0 12px 28px ${rgba(ink, 0.08)}`,
  /** Hovered tile */
  raised: `0 6px 18px ${rgba(ink, 0.07)}`,
  /** Floating menus and the mobile sidebar */
  menu: `0 6px 16px ${rgba(ink, 0.2)}`,
  drawer: `0 0 60px ${rgba(ink, 0.25)}`,
  /** Dialogs */
  popover: `0 24px 64px ${rgba(ink, 0.28)}, 0 2px 6px ${rgba(ink, 0.08)}`,
  /** Solid brand and danger buttons, with a light top edge */
  primary: `0 1px 2px rgb(6 70 46 / 0.35), ${highlight}`,
  danger: `0 1px 2px ${rgba(coral, 0.35)}, ${highlight}`,
  /** Brand glow under coloured panels and CTAs */
  cta: `0 4px 10px ${rgba(brand, 0.3)}`,
  "cta-lg": `0 10px 24px ${rgba(brand, 0.3)}`,
  /** Keyboard focus halo around fields */
  focus: `0 0 0 3px ${rgba(brand, 0.16)}`,
  "focus-danger": `0 0 0 3px ${rgba(coral, 0.16)}`,
  /** Hairline inset, for tiles on tinted surfaces */
  hairline: `inset 0 0 0 1px ${rgba(ink, 0.08)}`,
  "avatar-ring": "inset 0 0 0 2px rgb(255 255 255 / 0.7)",
} as const;

/** Translucent overlays and fills on coloured backgrounds. */
export const overlay = {
  scrim: rgba(ink, 0.5),
  "scrim-soft": rgba(ink, 0.4),
  "white-muted": "rgb(255 255 255 / 0.2)",
} as const;

export function buildThemeCss(): string {
  const vars: string[] = [];
  const set = (prefix: string, values: Record<string, string>) => {
    for (const [key, value] of Object.entries(values)) vars.push(`--${prefix}-${key}:${value};`);
  };

  for (const [name, scale] of Object.entries(palette)) {
    for (const step of steps) vars.push(`--color-${name}-${step}:${scale[step]};`);
  }
  for (const token of semantic) vars.push(`--color-${token.name}:${token.value};`);
  set("color", overlay);
  set("radius", radius);
  set("shadow", shadow);
  set("space", space);
  set("font-size", fontSize);
  set("control", controlSize);
  set("icon", iconSize);
  set("duration", duration);
  set("ease", easing);

  const typeClasses = typeScale
    .map(
      (t) =>
        `.text-${t.name}{font-size:${t.size / 16}rem;line-height:${t.lineHeight};font-weight:${t.weight};letter-spacing:${t.tracking};}`,
    )
    .join("");

  return `:root{${vars.join("")}}${typeClasses}`;
}
