"use client";

import { useMemo } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { HyperCalendar } from "@/components/charts/hyper-calendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Appointment } from "./data";
import { formatDate, type ISODate } from "./dates";
import styles from "./appointments.module.css";

/** The dashboard's appointments heatmap, made pickable: one square per day, shaded by how busy it is. */
export function MiniCalendar({
  month,
  selected,
  appointments,
  onSelect,
  onMonthChange,
}: {
  /** Any date inside the month being shown. */
  month: ISODate;
  selected: ISODate;
  appointments: readonly Appointment[];
  onSelect: (date: ISODate) => void;
  onMonthChange: (direction: -1 | 1) => void;
}) {
  const prefix = month.slice(0, 7);
  const year = Number(month.slice(0, 4));
  const monthIndex = Number(month.slice(5, 7)) - 1;

  const { values, total } = useMemo(() => {
    const values: Record<number, number> = {};
    let total = 0;
    for (const { date } of appointments) {
      if (!date.startsWith(prefix)) continue;
      const day = Number(date.slice(8));
      values[day] = (values[day] ?? 0) + 1;
      total++;
    }
    return { values, total };
  }, [appointments, prefix]);

  const monthName = formatDate(month, { month: "long", year: "numeric" });

  return (
    <Card
      title="Appointments"
      description={monthName}
      action={
        <div className={styles.monthNav}>
          <Button variant="secondary" size="sm" iconOnly aria-label="Previous month" onClick={() => onMonthChange(-1)}>
            <LuChevronLeft />
          </Button>
          <Button variant="secondary" size="sm" iconOnly aria-label="Next month" onClick={() => onMonthChange(1)}>
            <LuChevronRight />
          </Button>
        </div>
      }
    >
      <p className={`text-h2 num ${styles.monthTotal}`} aria-live="polite">
        {total}
        <span className="text-small text-muted"> this month</span>
      </p>
      <HyperCalendar
        year={year}
        month={monthIndex}
        values={values}
        unit="appointments"
        empty="No appointments"
        label={`Appointments per day in ${monthName}, shaded from fewest to most. Pick a day to see its schedule.`}
        selected={selected.startsWith(prefix) ? Number(selected.slice(8)) : undefined}
        onSelect={(day) => onSelect(`${prefix}-${String(day).padStart(2, "0")}`)}
      />
    </Card>
  );
}
