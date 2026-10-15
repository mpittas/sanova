"use client";

import { useMemo, useState } from "react";
import { appointments, nextUp, stageOf, TODAY } from "./data";
import {
  addDays,
  addMonths,
  endOfMonth,
  formatDate,
  startOfMonth,
  startOfWeek,
  type ISODate,
} from "./dates";
import { SplitLayout } from "@/components/layout/split-layout";
import { AppointmentDetails } from "./appointment-details";
import { MiniCalendar } from "./mini-calendar";
import { ScheduleCard, type ScheduleFilter, type ScheduleGroup, type View } from "./schedule-card";

const datesWithAppointments: ReadonlySet<ISODate> = new Set(appointments.map((item) => item.date));

function rangeFor(view: View, date: ISODate): [ISODate, ISODate] {
  if (view === "Day") return [date, date];
  if (view === "Week") {
    const start = startOfWeek(date);
    return [start, addDays(start, 6)];
  }
  return [startOfMonth(date), endOfMonth(date)];
}

function titleFor(view: View, date: ISODate) {
  const [from, to] = rangeFor(view, date);
  if (view === "Day") return formatDate(date, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  if (view === "Month") return formatDate(date, { month: "long", year: "numeric" });
  return `${formatDate(from, { month: "short", day: "numeric" })} – ${formatDate(to, { month: "short", day: "numeric", year: "numeric" })}`;
}

function step(view: View, date: ISODate, direction: -1 | 1) {
  if (view === "Day") return addDays(date, direction);
  if (view === "Week") return addDays(date, direction * 7);
  return addMonths(date, direction);
}

export function AppointmentsView() {
  const [selectedDate, setSelectedDate] = useState<ISODate>(TODAY);
  const [month, setMonth] = useState<ISODate>(TODAY);
  const [view, setView] = useState<View>("Day");
  const [selectedId, setSelectedId] = useState<string | undefined>(nextUp?.id);
  const [filter, setFilter] = useState<ScheduleFilter>("All");

  const { groups, visible, counts } = useMemo(() => {
    const [from, to] = rangeFor(view, selectedDate);
    const inRange = appointments
      .filter((item) => item.date >= from && item.date <= to)
      .sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start));

    const counts: Record<ScheduleFilter, number> = { All: inRange.length, Upcoming: 0, Completed: 0, Cancelled: 0 };
    for (const item of inRange) counts[stageOf(item.status)]++;
    const shown = filter === "All" ? inRange : inRange.filter((item) => stageOf(item.status) === filter);

    const byDate = new Map<ISODate, ScheduleGroup>();
    for (const item of shown) {
      const group = byDate.get(item.date) ?? { date: item.date, items: [] };
      group.items.push(item);
      byDate.set(item.date, group);
    }
    return { groups: [...byDate.values()], visible: shown, counts };
  }, [view, selectedDate, filter]);

  // If the chosen appointment isn't in the current range, fall back to the first one.
  const current = visible.find((item) => item.id === selectedId) ?? visible[0];

  const goTo = (date: ISODate) => {
    setSelectedDate(date);
    setMonth(date);
  };

  return (
    <SplitLayout
      aside={
        <>
          <MiniCalendar
            month={month}
            selected={selectedDate}
            datesWithAppointments={datesWithAppointments}
            onSelect={goTo}
            onMonthChange={(direction) => setMonth(addMonths(month, direction))}
          />
          <AppointmentDetails appointment={current} />
        </>
      }
    >
      <ScheduleCard
        title={titleFor(view, selectedDate)}
        view={view}
        groups={groups}
        filter={filter}
        counts={counts}
        selectedId={current?.id}
        onViewChange={setView}
        onFilterChange={setFilter}
        onStep={(direction) => goTo(step(view, selectedDate, direction))}
        onToday={() => goTo(TODAY)}
        onSelectAppointment={setSelectedId}
      />
    </SplitLayout>
  );
}
