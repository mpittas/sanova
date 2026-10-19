import type { KeyboardEvent, ReactNode } from "react";
import {
  LuCalendar,
  LuCalendarOff,
  LuChevronLeft,
  LuChevronRight,
  LuCircleCheck,
  LuCircleX,
  LuClock,
  LuEllipsisVertical,
} from "react-icons/lu";
import dash from "@/components/dashboard/dashboard.module.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip, type ChipTone } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { Person } from "@/components/ui/person";
import { Segmented } from "@/components/ui/segmented";
import { Table, Th } from "@/components/ui/table";
import { Tabs, tabId } from "@/components/ui/tabs";
import { stages, statusMeta, type Appointment, type AppointmentStatus, type Stage } from "./data";
import { formatDate, formatTime, type ISODate } from "./dates";
import styles from "./appointments.module.css";

export const views = ["Day", "Week", "Month"] as const;
export type View = (typeof views)[number];

export const filters = ["All", ...stages] as const;
export type ScheduleFilter = "All" | Stage;

export type ScheduleGroup = { date: ISODate; items: Appointment[] };

const PANEL_ID = "schedule-appointments";

const statusChip: Record<AppointmentStatus, { tone: ChipTone; icon: ReactNode }> = {
  confirmed: { tone: "info", icon: <LuClock aria-hidden /> },
  "checked-in": { tone: "success", icon: <LuCircleCheck aria-hidden /> },
  pending: { tone: "warning", icon: <LuClock aria-hidden /> },
  unconfirmed: { tone: "neutral", icon: <LuClock aria-hidden /> },
  completed: { tone: "success", icon: <LuCircleCheck aria-hidden /> },
  cancelled: { tone: "danger", icon: <LuCircleX aria-hidden /> },
};

export function ScheduleCard({
  title,
  view,
  groups,
  filter,
  counts,
  selectedId,
  onViewChange,
  onFilterChange,
  onStep,
  onToday,
  onSelectAppointment,
}: {
  title: string;
  view: View;
  groups: ScheduleGroup[];
  filter: ScheduleFilter;
  /** Appointments in the current range for each filter, ignoring the active one. */
  counts: Record<ScheduleFilter, number>;
  selectedId: string | undefined;
  onViewChange: (view: View) => void;
  onFilterChange: (filter: ScheduleFilter) => void;
  onStep: (direction: -1 | 1) => void;
  onToday: () => void;
  onSelectAppointment: (id: string) => void;
}) {
  const unit = view.toLowerCase();

  const selectOnKey = (id: string) => (event: KeyboardEvent<HTMLTableRowElement>) => {
    if (event.target !== event.currentTarget || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    onSelectAppointment(id);
  };

  return (
    <Card
      title={
        <span className={styles.title}>
          <LuCalendar aria-hidden />
          <span aria-live="polite">{title}</span>
        </span>
      }
      description={`${counts.All} ${counts.All === 1 ? "appointment" : "appointments"}`}
      action={
        <div className={styles.toolbar}>
          <div className={styles.stepper}>
            <Button variant="secondary" size="sm" iconOnly aria-label={`Previous ${unit}`} onClick={() => onStep(-1)}>
              <LuChevronLeft />
            </Button>
            <Button variant="secondary" size="sm" iconOnly aria-label={`Next ${unit}`} onClick={() => onStep(1)}>
              <LuChevronRight />
            </Button>
          </div>
          <Button variant="secondary" size="sm" onClick={onToday}>
            Today
          </Button>
          <Segmented aria-label="Calendar view" value={view} options={views} onChange={onViewChange} />
        </div>
      }
    >
      <Tabs
        variant="pill"
        aria-label="Appointment status"
        panelId={PANEL_ID}
        value={filter}
        options={filters}
        counts={counts}
        onChange={onFilterChange}
      />
      <div id={PANEL_ID} role="tabpanel" aria-labelledby={tabId(PANEL_ID, filter)}>
        {groups.length === 0 ? (
          <EmptyState
            icon={LuCalendarOff}
            title="No appointments"
            description={filter === "All" ? `Nothing is scheduled for this ${unit}.` : `No ${filter.toLowerCase()} appointments this ${unit}.`}
          />
        ) : (
          <Table variant="simple" className={dash.appointments} minWidth={600}>
            <thead>
              <tr>
                <Th>Patient</Th>
                <Th>Visit</Th>
                <Th>Mode</Th>
                <Th>Time</Th>
                <Th>Status</Th>
                <Th className={dash.colMore}>
                  <span className="sr-only">Actions</span>
                </Th>
              </tr>
            </thead>
            {groups.map(({ date, items }) => (
              <tbody key={date}>
                {view !== "Day" && (
                  <tr>
                    <th colSpan={6} scope="colgroup" className={styles.groupHeader}>
                      {formatDate(date, { weekday: "long", month: "long", day: "numeric" })}
                    </th>
                  </tr>
                )}
                {items.map(({ id, start, patient, mrn, title: visitTitle, summary, mode, status }) => {
                  const [time, period] = formatTime(start).split(" ");
                  return (
                    <tr
                      key={id}
                      className={styles.row}
                      data-selected={id === selectedId || undefined}
                      tabIndex={0}
                      onClick={() => onSelectAppointment(id)}
                      onKeyDown={selectOnKey(id)}
                    >
                      <td>
                        <span className={styles.patient}>
                          <span className={styles.statusDot} style={{ background: statusMeta[status].color }} role="img" aria-label={statusMeta[status].label} />
                          <Person name={patient} subtitle={`MRN: ${mrn}`} size={48} />
                        </span>
                      </td>
                      <td>
                        <span className={`${dash.visit} ${styles.visit}`}>
                          <span className={`text-label ${dash.visitTitle}`}>{visitTitle}</span>
                          <span className="text-small text-muted">{summary}</span>
                        </span>
                      </td>
                      <td>
                        <Chip variant="tag" tone={mode === "Telehealth" ? "violet" : "info"}>
                          {mode}
                        </Chip>
                      </td>
                      <td className={`num ${dash.figure} ${dash.time}`}>
                        {time} <span>{period}</span>
                      </td>
                      <td>
                        <Chip tone={statusChip[status].tone} icon={statusChip[status].icon}>
                          {statusMeta[status].label}
                        </Chip>
                      </td>
                      <td className={dash.colMore}>
                        <Button variant="ghost" size="sm" iconOnly aria-label={`More actions for ${patient}`}>
                          <LuEllipsisVertical />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            ))}
          </Table>
        )}
      </div>
    </Card>
  );
}
