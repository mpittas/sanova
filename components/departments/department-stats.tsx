"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { IconType } from "react-icons";
import { LuCalendarDays, LuLayoutGrid, LuSmile, LuStethoscope } from "react-icons/lu";
import { smoothPath } from "@/components/charts/hyper";
import { Card } from "@/components/ui/card";
import { CountUp } from "@/components/ui/count-up";
import { StatGrid } from "@/components/ui/stat-tile";
import { ToneTile, type Tone } from "@/components/ui/tone-tile";
import { activity, activityMonths, buildTotals, latestGrowth, type Department } from "./data";
import styles from "./department-stats.module.css";

const WAVE_HEIGHT = 46;
/** Room left after the line's last point, so the resting dot sits clear of the right edge. */
const WAVE_END_INSET = 28;

/**
 * Clinic-wide figures, derived from the department list. Each tile has its own tone: a small icon, the figure with a
 * note chip beside it, and a smooth line along the bottom edge: patients, doctors and satisfaction across the
 * departments, and appointments over the last six months.
 */
export function DepartmentStats({ departments }: { departments: readonly Department[] }) {
  const totals = buildTotals(departments);
  const byDoctors = departments.toSorted((a, b) => b.doctors - a.doctors);
  const monthly = activityMonths.map((_, index) =>
    departments.reduce((sum, department) => sum + activity["This Year"][department.name][index], 0),
  );
  const growth = latestGrowth(monthly);

  return (
    <StatGrid>
      <Tile
        label="Departments"
        icon={LuLayoutGrid}
        tone="primary"
        value={totals.departments}
        note="All open"
        wave={{ name: "Patients by department", data: departments.map((d) => d.patients) }}
      />
      <Tile
        label="Doctors"
        icon={LuStethoscope}
        tone="violet"
        value={totals.doctors}
        note={`${byDoctors[0].doctors} in ${byDoctors[0].name}`}
        wave={{ name: "Doctors by department", data: departments.map((d) => d.doctors) }}
      />
      <Tile
        label="Monthly appointments"
        icon={LuCalendarDays}
        tone="amber"
        value={totals.appointments.toLocaleString("en-US")}
        note={`↑ ${growth}% vs ${activityMonths.at(-2)}`}
        wave={{ name: "Appointments per month", data: monthly }}
      />
      <Tile
        label="Patient satisfaction"
        icon={LuSmile}
        tone="success"
        value={totals.satisfaction}
        unit="%"
        note={`${(totals.satisfaction / 20).toFixed(1)} / 5`}
        wave={{ name: "Satisfaction by department", data: departments.map((d) => d.satisfaction) }}
      />
    </StatGrid>
  );
}

type TileProps = {
  label: string;
  icon: IconType;
  tone: Tone;
  value: number | string;
  unit?: string;
  note: ReactNode;
  wave: { name: string; data: readonly number[] };
};

function Tile({ label, icon: Icon, tone, value, unit, note, wave }: TileProps) {
  return (
    <Card className={styles.tile} data-tone={tone}>
      <div className={styles.top}>
        <p className={styles.label}>{label}</p>
        <ToneTile tone={tone} size={30}>
          <Icon />
        </ToneTile>
      </div>
      <div className={styles.row}>
        <p className={styles.figure}>
          <CountUp value={String(value)} />
          {unit && <span className={styles.unit}>{unit}</span>}
        </p>
        <p className={styles.note}>{note}</p>
      </div>
      <Wave {...wave} />
    </Card>
  );
}

/**
 * Smooth line edge to edge along the bottom of the tile. The line draws in from the left while a
 * dot rides its tip and comes to rest on the last value. Drawn in real pixels (measured), so the dot can follow the
 * exact path without being stretched.
 */
function Wave({ name, data }: { name: string; data: readonly number[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const gradient = useId();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    setWidth(node.offsetWidth);
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const low = Math.min(...data);
  const range = Math.max(...data) - low || 1;
  // The line keeps between 18% and 70% of the height (room for the dot above and below) and stops short of the
  // right edge so the dot isn't clipped.
  const end = width - WAVE_END_INSET;
  const points = data.map((value, index) => [(index / (data.length - 1)) * end, WAVE_HEIGHT * (0.7 - ((value - low) / range) * 0.52)] as const);
  const line = smoothPath(points, WAVE_HEIGHT);

  return (
    <div ref={ref} className={styles.wave} role="img" aria-label={`${name}: ${data.join(", ")}`}>
      {width > 0 && (
        <>
          <svg width={width} height={WAVE_HEIGHT} aria-hidden>
            <defs>
              <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="currentColor" stopOpacity="0.22" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${line} L${end},${WAVE_HEIGHT} L0,${WAVE_HEIGHT} Z`} fill={`url(#${gradient})`} className={styles.waveFill} />
            <path d={line} className={styles.waveLine} pathLength={1} />
          </svg>
          <span className={styles.waveDot} style={{ offsetPath: `path("${line}")` } as CSSProperties} />
        </>
      )}
    </div>
  );
}
