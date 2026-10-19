import type { Tone } from "@/components/ui/tone-tile";

/** Twelve months of sample clinic figures, June 2023 to May 2024 (the workspace "today" is 9 May 2024). */
export const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"] as const;

export const ranges = ["6 months", "12 months"] as const;
export type Range = (typeof ranges)[number];
export const rangeLength: Record<Range, number> = { "6 months": 6, "12 months": 12 };

export const monthly = {
  inPerson: [312, 298, 284, 331, 352, 340, 318, 361, 374, 389, 402, 418],
  telemedicine: [94, 102, 110, 118, 131, 142, 150, 158, 171, 183, 196, 214],
  /** Billed and collected, in thousands of dollars. */
  billed: [38.2, 37.1, 36.4, 41.0, 44.6, 43.8, 42.1, 46.9, 49.3, 51.7, 54.2, 57.6],
  collected: [35.6, 34.8, 34.0, 38.7, 41.9, 41.0, 39.2, 43.8, 46.2, 48.6, 50.9, 54.0],
  /** Average minutes a patient waits. */
  wait: [24, 25, 26, 23, 22, 22, 23, 21, 20, 19, 18, 17],
  /** Satisfaction score, %. */
  satisfaction: [89, 88, 88, 90, 91, 91, 90, 92, 93, 93, 94, 95],
} as const;

/** Share of all visits by department, %. Sums to 100. */
export const departmentMix: { name: string; share: number; tone: Tone }[] = [
  { name: "General Medicine", share: 26, tone: "primary" },
  { name: "Cardiology", share: 19, tone: "blue" },
  { name: "Pediatrics", share: 17, tone: "violet" },
  { name: "Orthopedics", share: 15, tone: "coral" },
  { name: "Neurology", share: 14, tone: "amber" },
  { name: "Dermatology", share: 9, tone: "teal" },
];

/** Visits per day for May 2024: quiet weekends, a busy middle of the week. */
export const busiestDays: Record<number, number> = Object.fromEntries(
  Array.from({ length: 31 }, (_, index) => {
    const day = index + 1;
    const weekday = new Date(2024, 4, day).getDay();
    if (weekday === 0) return [day, 0];
    const base = 34 + ((day * 7) % 13) * 3;
    return [day, weekday === 6 ? Math.round(base * 0.45) : weekday === 2 || weekday === 3 ? base + 12 : base];
  }),
);

export const sum = (values: readonly number[]) => values.reduce((total, value) => total + value, 0);
export const last = <T,>(values: readonly T[], count: number) => values.slice(-count);
export const percentChange = (from: number, to: number) => `${Math.abs(Math.round(((to - from) / from) * 100))}%`;
