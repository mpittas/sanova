import Link from "next/link";
import { LuArrowRight, LuEllipsisVertical } from "react-icons/lu";
import { Person } from "@/components/ui/person";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip, type ChipTone } from "@/components/ui/chip";
import { Table, Th } from "@/components/ui/table";
import { appointments, type AppointmentStatus } from "./data";
import styles from "./dashboard.module.css";

const statusTone: Record<AppointmentStatus, ChipTone> = {
  "Checked In": "success",
  Upcoming: "info",
  Rescheduled: "warning",
};

export function UpcomingAppointments() {
  return (
    <Card
      title="Upcoming Appointments"
      description="Today's schedule"
      action={
        <Link href="/appointments" className={`text-label ${styles.viewAll}`}>
          View all <LuArrowRight aria-hidden />
        </Link>
      }
    >
      <Table variant="simple">
        <thead>
          <tr>
            <Th>Time</Th>
            <Th>Patient</Th>
            <Th className={styles.colStatus}>Status</Th>
            <Th>
              <span className="sr-only">Actions</span>
            </Th>
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
                <Chip tone={statusTone[status]}>{status}</Chip>
              </td>
              <td className="table-actions">
                <Button variant="ghost" size="sm" iconOnly aria-label={`More actions for ${patient}`}>
                  <LuEllipsisVertical />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
