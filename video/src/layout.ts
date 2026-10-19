/** World coordinates (px) of every panel, laid out like the real dashboard. */
export type Box = { x: number; y: number; w: number; h: number };

export const L = {
  sidebar: { x: 20, y: 40, w: 250, h: 1330 } as Box,
  header: { x: 300, y: 40, w: 1240, h: 96 } as Box,
  stat: (i: number): Box => ({ x: 300 + i * 310, y: 160, w: 290, h: 196 }),
  table: { x: 300, y: 380, w: 800, h: 650 } as Box,
  calendar: { x: 1120, y: 380, w: 420, h: 300 } as Box,
  depts: { x: 1120, y: 700, w: 420, h: 330 } as Box,
  trends: { x: 300, y: 1060, w: 600, h: 360 } as Box,
  demo: { x: 920, y: 1060, w: 620, h: 360 } as Box,
};

/** The tabs row inside the appointments card (local to the card). */
export const TABS = [
  { label: "All", x: 0, w: 56 },
  { label: "Checked In", x: 64, w: 112 },
  { label: "Upcoming", x: 184, w: 100 },
  { label: "Rescheduled", x: 292, w: 116 },
];
export const TABS_Y = 112;
export const ROWS_Y = 214;
export const ROW_H = 66;
