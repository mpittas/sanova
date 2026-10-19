"use client";

import { LuChevronLeft, LuChevronRight, LuPhone, LuVideo, LuVideoOff } from "react-icons/lu";
import { addMonths, formatDate, formatTime, type ISODate } from "@/components/appointments/dates";
import { HyperCalendar } from "@/components/charts/hyper-calendar";
import { Person } from "@/components/ui/person";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { type Session, type SessionStatus } from "./data";
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
  const [year, month, selectedDay] = selected.split("-").map(Number);
  const values: Record<number, number> = {};
  for (const session of sessions) {
    if (session.date.slice(0, 7) === selected.slice(0, 7)) {
      const date = Number(session.date.slice(8));
      values[date] = (values[date] ?? 0) + 1;
    }
  }
  const day = sessions.filter((session) => session.date === selected).sort((a, b) => a.start.localeCompare(b.start));

  return (
    <Card
      rounded
      title="Your schedule"
      description="Consultations at a glance."
      className={styles.widget}
      action={
        <Button href="/appointments" variant="ghost" size="sm">
          Full calendar
        </Button>
      }
    >
      <div className={styles.weekHeader}>
        <LuVideo aria-hidden />
        <h3 className="text-label" aria-live="polite">
          {formatDate(selected, { month: "long", year: "numeric" })}
        </h3>
        <span className="spacer" />
        <Button variant="ghost" size="sm" iconOnly aria-label="Previous month" onClick={() => onSelect(addMonths(selected, -1))}>
          <LuChevronLeft />
        </Button>
        <Button variant="ghost" size="sm" iconOnly aria-label="Next month" onClick={() => onSelect(addMonths(selected, 1))}>
          <LuChevronRight />
        </Button>
      </div>

      <HyperCalendar year={year} month={month - 1} values={values} unit="sessions" empty="No sessions" label={`Consultations in ${formatDate(selected, { month: "long", year: "numeric" })}`} selected={selectedDay} onSelect={(date) => onSelect(`${selected.slice(0, 7)}-${String(date).padStart(2, "0")}` as ISODate)} />
      <div className={styles.agendaHeading}><h3>{formatDate(selected, { weekday: "short", month: "short", day: "numeric" })}</h3><span>{day.length} {day.length === 1 ? "session" : "sessions"}</span></div>

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
