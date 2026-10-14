import { formatTime } from "@/components/appointments/dates";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip, type ChipTone } from "@/components/ui/chip";
import { doctorByName, todaySchedule, type ScheduleStatus } from "./data";
import styles from "./doctors.module.css";

const statusTone: Record<ScheduleStatus, ChipTone> = {
  Completed: "success",
  "In Progress": "violet",
  Upcoming: "info",
};

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
      <ul className={styles.schedule}>
        {todaySchedule.map(({ id, time, doctor, visit, status }) => (
          <li key={id}>
            <Avatar name={doctor} src={doctorByName(doctor)?.photo} size={40} />
            <span className={styles.scheduleText}>
              <span className="text-label">{doctor}</span>
              <span className="text-small text-muted">{visit}</span>
            </span>
            <span className={styles.scheduleMeta}>
              <span className="text-small text-muted num">{formatTime(time)}</span>
              <Chip size="sm" tone={statusTone[status]}>
                {status}
              </Chip>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
