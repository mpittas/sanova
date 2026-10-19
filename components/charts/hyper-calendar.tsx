"use client";

import { useState } from "react";
import styles from "./hyper.module.css";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const LEVELS = [1, 2, 3, 4, 5] as const;

type Cell = { date: Date; inMonth: boolean };

/** The month as full weeks (Sunday first), padded with the neighbouring months' days. */
function monthCells(year: number, month: number): Cell[] {
  const first = new Date(year, month, 1);
  const days = new Date(year, month + 1, 0).getDate();
  const lead = first.getDay();
  const total = Math.ceil((lead + days) / 7) * 7;
  return Array.from({ length: total }, (_, index) => {
    const date = new Date(year, month, 1 - lead + index);
    return { date, inMonth: date.getMonth() === month };
  });
}

/**
 * Heatmap calendar (light theme): one rounded square per day, shaded in five steps of the brand green by how the day
 * compares with the month's best. Days with no value (e.g. closed) stay blank. Plain HTML/CSS.
 */
export function HyperCalendar({
  year,
  month,
  values,
  prefix = "",
  unit,
  empty = "None",
  label,
  selected,
  onSelect,
}: {
  year: number;
  /** 0-based month. */
  month: number;
  /** Value per day of the month, keyed by day number (1–31). */
  values: Readonly<Record<number, number>>;
  /** Shown before a day's value in the tooltip and for screen readers, e.g. "$". */
  prefix?: string;
  /** Noun shown after a day's value, e.g. "appointments". */
  unit?: string;
  /** Text for a day with no value. */
  empty?: string;
  /** Accessible description of the chart. */
  label: string;
  /** Day of the month to outline as the current choice. */
  selected?: number;
  /** Makes each day of the month pickable. */
  onSelect?: (day: number) => void;
}) {
  const [active, setActive] = useState<number | null>(null);
  const cells = monthCells(year, month);
  const peak = Math.max(...Object.values(values), 1);
  const levelOf = (value: number) => (value > 0 ? Math.min(5, Math.max(1, Math.ceil((value / peak) * 5))) : 0);
  const format = (value: number) => `${prefix}${value.toLocaleString("en-US")}${unit ? ` ${unit}` : ""}`;
  const dayName = (date: Date) => date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className={styles.calendar}>
      <div className={styles.calHead} aria-hidden>
        {WEEKDAYS.map((day) => (
          <span key={day} className="text-caption">
            {day}
          </span>
        ))}
      </div>
      <div className={styles.calGrid} role={onSelect ? "group" : "img"} aria-label={label} onMouseLeave={() => setActive(null)}>
        {cells.map(({ date, inMonth }, index) => {
          const day = date.getDate();
          if (!inMonth) {
            return (
              <span key={index} className={`${styles.calDay} ${styles.calOutside} num`} aria-hidden>
                {day}
              </span>
            );
          }
          const value = values[day] ?? 0;
          return (
            <span
              key={index}
              className={`${styles.calDay} num`}
              data-level={levelOf(value)}
              data-edge={index % 7 === 0 ? "start" : index % 7 === 6 ? "end" : undefined}
              data-selected={day === selected || undefined}
              data-pickable={onSelect ? "" : undefined}
              tabIndex={0}
              role={onSelect ? "button" : undefined}
              aria-pressed={onSelect ? day === selected : undefined}
              aria-label={`${dayName(date)}: ${value > 0 ? format(value) : empty.toLowerCase()}`}
              onClick={onSelect && (() => onSelect(day))}
              onKeyDown={
                onSelect &&
                ((event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(day);
                  }
                })
              }
              onMouseEnter={() => setActive(day)}
              onFocus={() => setActive(day)}
              onBlur={() => setActive(null)}
            >
              {day}
              {active === day && (
                <span className={styles.calTip} role="status">
                  <span className="text-caption text-muted">{dayName(date)}</span>
                  <span className="text-label num">{value > 0 ? format(value) : empty}</span>
                </span>
              )}
            </span>
          );
        })}
      </div>
      <div className={styles.calLegend} aria-hidden>
        <span className="text-small text-muted">Less</span>
        {LEVELS.map((level) => (
          <span key={level} className={styles.calSwatch} data-level={level} />
        ))}
        <span className="text-small text-muted">More</span>
      </div>
    </div>
  );
}
