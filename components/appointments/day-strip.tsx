"use client";

import { useEffect, useState, type CSSProperties, type KeyboardEvent } from "react";
import styles from "./appointments.module.css";

export type StripDay = {
  date: string;
  /** "Thu, May 9" */
  label: string;
  today: boolean;
  /** Bar height from 0 to 1, relative to the busiest day. */
  height: number;
  parts: { stage: string; count: number }[];
};

/**
 * One bar per weekday. Hover or focus a bar to read that day; the others dim and a tooltip glides to it.
 * The strip is one tab stop: arrow keys move between days, Escape lets go.
 */
export function DayStrip({ days, label }: { days: readonly StripDay[]; label: string }) {
  const [active, setActive] = useState<number | null>(null);
  // The bars rise only once the page has mounted and painted. Started earlier, the animation would run its clock
  // while the page is still busy and its first frames would be skipped.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
    return () => cancelAnimationFrame(frame);
  }, []);
  const todayIndex = Math.max(0, days.findIndex((day) => day.today));
  const current = active === null ? null : days[active];

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const next = (active ?? todayIndex) + (event.key === "ArrowRight" ? 1 : -1);
      setActive(Math.min(days.length - 1, Math.max(0, next)));
    } else if (event.key === "Escape") {
      setActive(null);
    }
  };

  const visits = current?.parts.filter((part) => part.count > 0) ?? [];

  return (
    <div
      className={styles.strip}
      role="group"
      aria-label={label}
      tabIndex={0}
      data-active={active !== null || undefined}
      data-ready={ready || undefined}
      onPointerLeave={() => setActive(null)}
      onBlur={() => setActive(null)}
      onKeyDown={onKeyDown}
    >
      {days.map((day, index) => (
        <span
          key={day.date}
          className={styles.day}
          data-today={day.today || undefined}
          data-empty={day.height === 0 || undefined}
          data-current={active === index || undefined}
          style={{ "--h": day.height, "--i": index } as CSSProperties}
          onPointerEnter={() => setActive(index)}
        >
          <span className={styles.bar}>
            {day.parts.map((part) => (
              <i key={part.stage} data-stage={part.stage} style={{ flexGrow: part.count }} />
            ))}
          </span>
        </span>
      ))}
      <span
        className={styles.tip}
        data-show={current ? true : undefined}
        style={{ "--x": ((active ?? 0) + 0.5) / days.length } as CSSProperties}
        aria-live="polite"
      >
        {current && (
          <>
            <strong>{current.today ? `${current.label} (today)` : current.label}</strong>
            {visits.length === 0 ? (
              <span>No visits</span>
            ) : (
              visits.map((part) => (
                <span key={part.stage}>
                  <i data-stage={part.stage} />
                  {part.count} {part.stage.toLowerCase()}
                </span>
              ))
            )}
          </>
        )}
      </span>
    </div>
  );
}
