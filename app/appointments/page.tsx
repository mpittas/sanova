import type { Metadata } from "next";
import { LuPlus } from "react-icons/lu";
import { AppointmentStats } from "@/components/appointments/appointment-stats";
import { AppointmentsView } from "@/components/appointments/appointments-view";
import { AppHeader } from "@/components/dashboard/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import styles from "@/components/appointments/appointments.module.css";

export const metadata: Metadata = {
  title: "Appointments",
  description: "View and manage your schedule, appointments, and availability.",
};

export default function AppointmentsPage() {
  return (
    <AppShell>
      <AppHeader />
      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className="text-h1">Appointments</h1>
            <p className="text-body-lg text-muted">View and manage your schedule, appointments, and availability.</p>
          </div>
          <Button iconLeft={<LuPlus />}>Book Appointment</Button>
        </div>

        <AppointmentStats />
        <AppointmentsView />
      </main>
    </AppShell>
  );
}
