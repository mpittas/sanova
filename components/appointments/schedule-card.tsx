import { LuCalendar, LuCalendarOff, LuChevronLeft, LuChevronRight, LuEllipsis } from "react-icons/lu";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Segmented } from "@/components/ui/segmented";
import { statusMeta, type Appointment } from "./data";
import { formatDate, formatTime, type ISODate } from "./dates";
import styles from "./appointments.module.css";

export const views = ["Day", "Week", "Month"] as const;
export type View = (typeof views)[number];

export type ScheduleGroup = { date: ISODate; items: Appointment[] };

export function ScheduleCard({
  title,
  view,
  groups,
  selectedId,
  onViewChange,
  onStep,
  onToday,
  onSelectAppointment,
}: {
  title: string;
  view: View;
  groups: ScheduleGroup[];
  selectedId: string | undefined;
  onViewChange: (view: View) => void;
  onStep: (direction: -1 | 1) => void;
  onToday: () => void;
  onSelectAppointment: (id: string) => void;
}) {
  const unit = view.toLowerCase();

  return (
    <Card className={styles.schedule}>
      <div className={styles.toolbar}>
        <div className={styles.stepper}>
          <Button variant="secondary" size="sm" shape="rounded" iconOnly aria-label={`Previous ${unit}`} onClick={() => onStep(-1)}>
            <LuChevronLeft />
          </Button>
          <Button variant="secondary" size="sm" shape="rounded" iconOnly aria-label={`Next ${unit}`} onClick={() => onStep(1)}>
            <LuChevronRight />
          </Button>
        </div>
        <div className={styles.toolbarTitle}>
          <LuCalendar aria-hidden />
          <h2 className="text-h4" aria-live="polite">
            {title}
          </h2>
        </div>
        <Button variant="secondary" size="sm" shape="rounded" onClick={onToday}>
          Today
        </Button>
        <span className={styles.spacer} />
        <Segmented aria-label="Calendar view" value={view} options={views} onChange={onViewChange} />
      </div>

      {groups.length === 0 ? (
        <div className={styles.empty}>
          <LuCalendarOff aria-hidden />
          <p className="text-label">No appointments</p>
          <p className="text-small text-muted">Nothing is scheduled for this {unit}.</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {groups.map(({ date, items }) => (
            <li key={date} className={styles.group}>
              {view !== "Day" && (
                <p className={styles.groupHeader}>{formatDate(date, { weekday: "long", month: "long", day: "numeric" })}</p>
              )}
              <ul className={styles.rows}>
                {items.map((appointment) => {
                  const { id, start, patient, mrn, title: visitTitle, summary, mode, status } = appointment;
                  const isSelected = id === selectedId;
                  return (
                    <li key={id} className={styles.row} data-selected={isSelected || undefined}>
                      <button
                        type="button"
                        className={styles.rowSelect}
                        aria-pressed={isSelected}
                        aria-label={`${formatTime(start)}, ${patient}, ${visitTitle}`}
                        onClick={() => onSelectAppointment(id)}
                      />
                      <span className={`${styles.rowTime} num`}>{formatTime(start)}</span>
                      <span className={styles.statusDot} style={{ background: statusMeta[status].color }} role="img" aria-label={statusMeta[status].label} />
                      <Avatar name={patient} size={40} />
                      <span className={styles.rowPatient}>
                        <span className="text-label">{patient}</span>
                        <span className="text-small text-muted">MRN: {mrn}</span>
                      </span>
                      <span className={styles.rowVisit}>
                        <span className="text-label">{visitTitle}</span>
                        <span className="text-small text-muted">{summary}</span>
                      </span>
                      <span className={`chip chip-flat ${mode === "Telehealth" ? "chip-violet" : "chip-info"} ${styles.rowMode}`}>{mode}</span>
                      <Button variant="ghost" size="sm" iconOnly className={styles.rowMenu} aria-label={`More actions for ${patient}`}>
                        <LuEllipsis />
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
