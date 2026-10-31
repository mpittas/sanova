"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Avatar } from "@/components/ui/avatar";
import { CountUp } from "@/components/ui/count-up";
import styles from "./day-ruler.module.css";

export type RulerSlot = { id: string; name: string; photo: string; specialty: string; tone: string; time: string };

const DAY_START = 8 * 60;
const DAY_END = 18 * 60;
const HOURS = Array.from({ length: 11 }, (_, i) => 8 + i);
/** Ruler ticks every half hour: tall on the hour. */
const TICKS = Array.from({ length: 21 }, (_, i) => i);
const LEVELS = 2;
/** Two slots closer than this (share of the track) go on different levels so their portraits never overlap. */
const CLOSE = 0.075;
/** On a narrow track the share is too small, so two portraits also need at least this many pixels between centres. */
const CLOSE_PX = 40;

const minutes = (time: string) => {
  const [hours, mins] = time.split(":").map(Number);
  return hours * 60 + mins;
};
const along = (time: string) => Math.min(1, Math.max(0, (minutes(time) - DAY_START) / (DAY_END - DAY_START)));
const short = (time: string) => {
  const [hours, mins] = time.split(":").map(Number);
  return `${hours % 12 || 12}:${String(mins).padStart(2, "0")}`;
};
const long = (time: string) => `${short(time)} ${Number(time.split(":")[0]) >= 12 ? "PM" : "AM"}`;
const hourLabel = (hour: number) => `${hour % 12 || 12}${hour >= 12 ? "pm" : "am"}`;

type Props = { title: string; summary: string; now: string; slots: readonly RulerSlot[] };

/**
 * Today as a timeline. The part of the day that has passed fills in, a glowing marker sits at the current time, and each
 * available doctor stands at the time of their next free slot. Hover or focus a slot to read it; the others dim.
 */
export function DayRuler({ title, summary, now, slots }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const close = width ? Math.max(CLOSE, CLOSE_PX / width) : CLOSE;
  const sorted = [...slots].sort((a, b) => a.time.localeCompare(b.time));
  // Greedy levels: take the lowest level whose last portrait is far enough away.
  const lastAt: number[] = [];
  const placed = sorted.map((slot) => {
    const at = along(slot.time);
    let level = lastAt.findIndex((end) => at - end >= close);
    if (level === -1) level = lastAt.length < LEVELS ? lastAt.length : lastAt.indexOf(Math.min(...lastAt));
    lastAt[level] = at;
    return { ...slot, at, level };
  });

  const nowAt = along(now);
  const next = sorted.find((slot) => minutes(slot.time) >= minutes(now));
  const specialties = [...new Map(sorted.map((slot) => [slot.specialty, slot.tone])).entries()];

  return (
    <section className={styles.ruler} aria-label="Care team overview">
      <div className={styles.rulerHead}>
        <div>
          <h2>{title}</h2>
          <p>{summary}</p>
        </div>
        <div className={styles.rulerStats}>
          <span className={styles.stat}>
            <b><CountUp value={String(slots.length)} /></b>
            <small>free today</small>
          </span>
          {next && (
            <span className={styles.stat} data-tone={next.tone}>
              <b>{long(next.time)}</b>
              <small>
                <Avatar name={next.name} src={next.photo} size={16} />
                next free · {next.name.replace(/^Dr\.?\s+/, "Dr. ")}
              </small>
            </span>
          )}
        </div>
      </div>

      <div className={styles.glass} data-active={active ? true : undefined}>
        <div className={styles.stage} ref={stage}>
          <div className={styles.grid} aria-hidden>
            {HOURS.map((hour) => (
              <i key={hour} style={{ left: `${((hour - 8) / 10) * 100}%` }} />
            ))}
          </div>
          <div className={styles.elapsed} style={{ "--now": nowAt } as CSSProperties} aria-hidden />
          <div className={styles.nowMark} style={{ left: `${nowAt * 100}%` }}>
            <span className={styles.nowPill}><i />Now · {long(now)}</span>
            <span className={styles.nowLine} aria-hidden />
          </div>

          {placed.map((slot, index) => (
            <button
              key={slot.id}
              type="button"
              className={styles.slot}
              data-level={slot.level}
              data-tone={slot.tone}
              data-current={active === slot.id ? true : undefined}
              data-flip={slot.at > 0.62 ? true : undefined}
              data-past={minutes(slot.time) < minutes(now) ? true : undefined}
              data-next={slot.id === next?.id ? true : undefined}
              style={{ left: `${slot.at * 100}%`, "--i": index } as CSSProperties}
              onPointerEnter={() => setActive(slot.id)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(slot.id)}
              onBlur={() => setActive(null)}
              aria-label={`${slot.name}, ${slot.specialty}, free at ${long(slot.time)}`}
            >
              <span className={styles.face}>
                <Avatar name={slot.name} src={slot.photo} size={34} />
              </span>
              <span className={styles.chip}>{short(slot.time)}</span>
              <span className={styles.stem} aria-hidden />
              <span className={styles.tip} aria-hidden>
                <strong>{slot.name}</strong>
                <small>{slot.specialty}</small>
                <em>Free at {long(slot.time)}</em>
              </span>
            </button>
          ))}

          <div className={styles.ticks} style={{ "--now": nowAt } as CSSProperties} aria-hidden>
            {TICKS.map((tick) => (
              <i key={tick} data-kind={tick % 2 === 0 ? "hour" : undefined} data-past={tick / 20 <= nowAt || undefined} style={{ left: `${(tick / 20) * 100}%` }} />
            ))}
          </div>

          <ol className={styles.hours} aria-hidden>
            {HOURS.map((hour) => (
              <li key={hour} data-past={hour * 60 <= minutes(now) || undefined} data-minor={hour % 2 === 1 || undefined} style={{ left: `${((hour - 8) / 10) * 100}%` }}>
                {hourLabel(hour)}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className={styles.rulerFoot}>
        <ul className={styles.legend} aria-label="Specialties">
          {specialties.map(([specialty, tone]) => (
            <li key={specialty} data-tone={tone}><i />{specialty}</li>
          ))}
        </ul>
        <span>Clinic hours · 8am – 6pm</span>
      </div>
    </section>
  );
}
