"use client";

import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate, monthGrid, type ISODate } from "./dates";
import styles from "./appointments.module.css";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MiniCalendar({
  month,
  selected,
  datesWithAppointments,
  onSelect,
  onMonthChange,
}: {
  /** Any date inside the month being shown. */
  month: ISODate;
  selected: ISODate;
  datesWithAppointments: ReadonlySet<ISODate>;
  onSelect: (date: ISODate) => void;
  onMonthChange: (direction: -1 | 1) => void;
}) {
  const cells = monthGrid(month);

  return (
    <Card className={styles.calendar}>
      <div className={styles.calendarHeader}>
        <Button variant="secondary" size="sm" shape="rounded" iconOnly aria-label="Previous month" onClick={() => onMonthChange(-1)}>
          <LuChevronLeft />
        </Button>
        <h2 className="text-h4" aria-live="polite">
          {formatDate(month, { month: "long", year: "numeric" })}
        </h2>
        <Button variant="secondary" size="sm" shape="rounded" iconOnly aria-label="Next month" onClick={() => onMonthChange(1)}>
          <LuChevronRight />
        </Button>
      </div>

      <div className={styles.calendarGrid}>
        {weekdays.map((day) => (
          <span key={day} className={styles.weekday} aria-hidden>
            {day}
          </span>
        ))}
        {cells.map(({ iso, inMonth }) => (
          <button
            key={iso}
            type="button"
            className={styles.day}
            data-outside={!inMonth || undefined}
            data-selected={iso === selected || undefined}
            data-has-appointments={datesWithAppointments.has(iso) || undefined}
            aria-pressed={iso === selected}
            aria-label={formatDate(iso, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            onClick={() => onSelect(iso)}
          >
            {Number(iso.slice(8))}
          </button>
        ))}
      </div>
    </Card>
  );
}
