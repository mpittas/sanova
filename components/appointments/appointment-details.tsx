import { LuCalendar, LuClock, LuEllipsis, LuFileText, LuMapPin, LuStickyNote, LuVideo } from "react-icons/lu";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import type { Appointment } from "./data";
import { addMinutes, formatDate, formatTime } from "./dates";
import styles from "./appointments.module.css";

export function AppointmentDetails({ appointment }: { appointment: Appointment | undefined }) {
  if (!appointment) {
    return (
      <Card className={styles.details}>
        <p className="text-body text-muted">Select an appointment to see its details.</p>
      </Card>
    );
  }

  const { patient, mrn, date, start, duration, mode, title, summary, notes } = appointment;
  const ModeIcon = mode === "Telehealth" ? LuVideo : LuMapPin;

  return (
    <Card className={styles.details} aria-label="Appointment details">
      <div className={styles.detailsHeader}>
        <Avatar name={patient} size={48} />
        <div className={styles.detailsPatient}>
          <p className="text-h4">{patient}</p>
          <p className="text-small text-muted">MRN: {mrn}</p>
        </div>
        <Button variant="secondary" size="sm">
          Edit
        </Button>
      </div>

      <ul className={styles.detailList}>
        <li>
          <LuCalendar aria-hidden />
          <span>{formatDate(date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
        </li>
        <li>
          <LuClock aria-hidden />
          <span>
            {formatTime(start)} – {formatTime(addMinutes(start, duration))} ({duration} minutes)
          </span>
        </li>
        <li>
          <ModeIcon aria-hidden />
          <Chip variant="tag" tone={mode === "Telehealth" ? "violet" : "info"}>
            {mode}
          </Chip>
        </li>
        <li data-top>
          <LuFileText aria-hidden />
          <span>
            <span className={styles.detailTitle}>{title}</span>
            <span className="text-muted">{summary}</span>
          </span>
        </li>
        <li data-top>
          <LuStickyNote aria-hidden />
          <span>
            <span className={styles.detailTitle}>Notes</span>
            <span className="text-muted">{notes}</span>
          </span>
        </li>
      </ul>

      <div className={styles.detailActions}>
        <Button>Start Appointment</Button>
        <Button variant="secondary">Reschedule</Button>
        <Button variant="secondary" iconOnly aria-label="More actions">
          <LuEllipsis />
        </Button>
      </div>
    </Card>
  );
}
