import { LuCalendar, LuClock, LuEllipsis, LuFileText, LuMapPin, LuStickyNote, LuVideo } from "react-icons/lu";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { DetailItem, DetailList } from "@/components/ui/detail-list";
import { stageOf, statusMeta, type Appointment } from "./data";
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

  const { patient, mrn, date, start, duration, mode, title, summary, notes, status } = appointment;
  const stage = stageOf(status);
  const ModeIcon = mode === "Telehealth" ? LuVideo : LuMapPin;

  return (
    <Card className={styles.details} aria-label="Appointment details">
      <div className={styles.detailsHeader}>
        <Avatar name={patient} size={48} />
        <div className={styles.detailsPatient}>
          <p className="text-h4">{patient}</p>
          <p className="text-small text-muted">MRN: {mrn}</p>
        </div>
        <Chip tone={stage === "Completed" ? "success" : stage === "Cancelled" ? "danger" : status === "pending" ? "warning" : status === "unconfirmed" ? "neutral" : "info"}>
          {statusMeta[status].label}
        </Chip>
        <Button variant="secondary" size="sm">
          Edit
        </Button>
      </div>

      <DetailList className={styles.detailList}>
        <DetailItem icon={LuCalendar}>{formatDate(date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</DetailItem>
        <DetailItem icon={LuClock}>
          {formatTime(start)} – {formatTime(addMinutes(start, duration))} ({duration} minutes)
        </DetailItem>
        <DetailItem icon={ModeIcon}>
          <Chip variant="tag" tone={mode === "Telehealth" ? "violet" : "info"}>
            {mode}
          </Chip>
        </DetailItem>
        <DetailItem icon={LuFileText} title={title}>
          {summary}
        </DetailItem>
        <DetailItem icon={LuStickyNote} title="Notes">
          {notes}
        </DetailItem>
      </DetailList>

      <div className={styles.detailActions}>
        {stage === "Upcoming" && (
          <>
            <Button>Start Appointment</Button>
            <Button variant="secondary">Reschedule</Button>
          </>
        )}
        {stage === "Completed" && <Button>View Visit Summary</Button>}
        {stage === "Cancelled" && (
          <>
            <Button>Rebook</Button>
            <Button variant="secondary">Contact Patient</Button>
          </>
        )}
        <Button variant="secondary" iconOnly aria-label="More actions">
          <LuEllipsis />
        </Button>
      </div>
    </Card>
  );
}
