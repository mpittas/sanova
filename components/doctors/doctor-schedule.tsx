import { formatTime } from "@/components/appointments/dates";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { doctorByName, todaySchedule } from "./data";
import styles from "./doctors.module.css";

/** Today's first appointments as a timeline: a time, a status dot on the rail, then the doctor and visit. */
export function DoctorSchedule() {
  return (
    <Card
      rounded
      title="Upcoming Doctor Schedules"
      description="Today's first appointments"
      action={
        <Button href="/appointments" variant="ghost" size="sm">
          View All
        </Button>
      }
    >
      <ol className={styles.timeline}>
        {todaySchedule.map(({ id, time, doctor, visit, status }) => (
          <li key={id} className={styles.slot} data-status={status.toLowerCase().replace(" ", "-")}>
            <span className={styles.slotTime}>{formatTime(time)}</span>
            <span className={styles.slotDot} aria-hidden />
            <span className={styles.slotBody}>
              <Avatar name={doctor} src={doctorByName(doctor)?.photo} size={36} />
              <span className="text-stack">
                <span className="text-label">{doctor}</span>
                <span className="text-small text-muted">{visit}</span>
              </span>
              {status === "In Progress" && <span className={styles.now}>Now</span>}
              {status === "Completed" && <span className="sr-only">Completed</span>}
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
