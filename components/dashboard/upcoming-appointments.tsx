import Link from "next/link";
import { LuArrowRight, LuEllipsisVertical } from "react-icons/lu";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { appointments, type AppointmentStatus } from "./data";
import styles from "./dashboard.module.css";

const chipClass: Record<AppointmentStatus, string> = {
  "Checked In": "chip-success",
  Upcoming: "chip-info",
  Rescheduled: "chip-warning",
};

export function UpcomingAppointments() {
  return (
    <Card
      title="Upcoming Appointments"
      description="Today's schedule"
      action={
        <Link href="/" className={`text-label ${styles.viewAll}`}>
          View all <LuArrowRight aria-hidden />
        </Link>
      }
    >
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Time</th>
            <th scope="col">Patient</th>
            <th scope="col" className={styles.colStatus}>
              Status
            </th>
            <th scope="col">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(({ time, period, patient, type, status }) => (
            <tr key={`${time}-${patient}`}>
              <td className={`num ${styles.time}`}>
                {time} <span>{period}</span>
              </td>
              <td>
                <div className={styles.patientCell}>
                  <Avatar name={patient} size={38} />
                  <span className={styles.patient}>
                    <span className="text-label">{patient}</span>
                    <span className="text-small text-muted">{type}</span>
                  </span>
                </div>
              </td>
              <td className={styles.colStatus}>
                <span className={`chip ${chipClass[status]}`}>{status}</span>
              </td>
              <td className={styles.rowAction}>
                <Button variant="ghost" size="sm" iconOnly aria-label={`More actions for ${patient}`}>
                  <LuEllipsisVertical />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
