import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { Person } from "@/components/ui/person";
import { Card } from "@/components/ui/card";
import { Table, Th } from "@/components/ui/table";
import { appointments, type AppointmentStatus } from "./data";
import styles from "./dashboard.module.css";

const statusTone: Record<AppointmentStatus, "success" | "info" | "warning"> = {
  "Checked In": "success",
  Upcoming: "info",
  Rescheduled: "warning",
};

export function UpcomingAppointments() {
  return (
    <Card
      title="Upcoming appointments"
      description="Today's schedule"
      action={
        <Link href="/appointments" className={`text-label ${styles.viewAll}`}>
          View all <LuArrowRight aria-hidden />
        </Link>
      }
    >
      <Table variant="simple" className={styles.appointments}>
        <thead>
          <tr>
            <Th>Time</Th>
            <Th>Patient</Th>
            <Th className={styles.colStatus}>Status</Th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(({ time, period, patient, type, status }) => (
            <tr key={`${time}-${patient}`}>
              <td className={`num ${styles.time}`}>
                {time} <span>{period}</span>
              </td>
              <td>
                <Person name={patient} subtitle={type} />
              </td>
              <td className={styles.colStatus}>
                <span className={styles.status} data-tone={statusTone[status]}>
                  {status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
