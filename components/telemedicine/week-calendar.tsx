"use client";

import { LuChevronLeft, LuChevronRight, LuPhone, LuVideo, LuVideoOff } from "react-icons/lu";
import { TODAY } from "@/components/appointments/data";
import { addDays, formatDate, formatTime, type ISODate } from "@/components/appointments/dates";
import { Person } from "@/components/ui/person";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { startOfIsoWeek, type Session, type SessionStatus } from "./data";
import styles from "./telemedicine.module.css";

const dotColor: Record<SessionStatus, string> = {
  scheduled: "var(--color-primary-500)",
  "in-progress": "var(--color-violet-500)",
  completed: "var(--color-neutral-300)",
  cancelled: "var(--color-coral-500)",
  waiting: "var(--color-amber-500)",
  requested: "var(--color-neutral-300)",
};

export function WeekCalendar({
  selected,
  sessions,
  onSelect,
  onOpen,
}: {
  selected: ISODate;
  /** Every session that has a time in the diary (not instant consults or requests). */
  sessions: readonly Session[];
  onSelect: (date: ISODate) => void;
  onOpen: (id: string) => void;
}) {
  const monday = startOfIsoWeek(selected);
  const days = Array.from({ length: 7 }, (_, index) => addDays(monday, index));
  const datesWithSessions = new Set(sessions.map((session) => session.date));
  const day = sessions.filter((session) => session.date === selected).sort((a, b) => a.start.localeCompare(b.start));

  return (
    <Card
      rounded
      title="Calendar"
      action={
        <Button href="/appointments" variant="ghost" size="sm">
          View All
        </Button>
      }
    >
      <div className={styles.weekHeader}>
        <LuVideo aria-hidden />
        <h3 className="text-label" aria-live="polite">
          {formatDate(selected, { month: "long", year: "numeric" })}
        </h3>
        <span className="spacer" />
        <Button variant="ghost" size="sm" iconOnly aria-label="Previous week" onClick={() => onSelect(addDays(selected, -7))}>
          <LuChevronLeft />
        </Button>
        <Button variant="ghost" size="sm" iconOnly aria-label="Next week" onClick={() => onSelect(addDays(selected, 7))}>
          <LuChevronRight />
        </Button>
      </div>

      <div className={styles.week} role="group" aria-label="Week">
        {days.map((date) => (
          <button
            key={date}
            type="button"
            className={styles.weekDay}
            data-selected={date === selected || undefined}
            data-today={date === TODAY || undefined}
            data-has-sessions={datesWithSessions.has(date) || undefined}
            aria-pressed={date === selected}
            aria-label={formatDate(date, { weekday: "long", month: "long", day: "numeric" })}
            onClick={() => onSelect(date)}
          >
            <span className={styles.weekName} aria-hidden>
              {formatDate(date, { weekday: "short" })}
            </span>
            <span className={`${styles.weekNumber} num`} aria-hidden>
              {Number(date.slice(8))}
            </span>
          </button>
        ))}
      </div>

      {day.length === 0 ? (
        <EmptyState size="compact" icon={LuVideoOff} title="No sessions" description={`Nothing is booked for ${formatDate(selected, { weekday: "long" })}.`} />
      ) : (
        <ol className={styles.timeline} aria-label={`Sessions on ${formatDate(selected, { weekday: "long", month: "long", day: "numeric" })}`}>
          {day.map((session) => {
            const CallIcon = session.callType === "Audio Call" ? LuPhone : LuVideo;
            return (
              <li key={session.id} data-status={session.status}>
                <span className={styles.timelineDot} style={{ background: dotColor[session.status] }} aria-hidden />
                <span className={`text-small text-muted num ${styles.timelineTime}`}>{formatTime(session.start)}</span>
                <button type="button" className={styles.timelineItem} onClick={() => onOpen(session.id)}>
                  <Person name={session.patient} subtitle={session.status === "cancelled" ? "Cancelled" : session.title} />
                  <span className={styles.timelineCall}>
                    <CallIcon aria-label={session.callType} role="img" />
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </Card>
  );
}
