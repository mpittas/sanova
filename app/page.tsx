import { AppHeader } from "@/components/dashboard/app-header";
import { AppointmentTrends } from "@/components/dashboard/appointment-trends";
import { AppointmentsCalendar } from "@/components/dashboard/appointments-calendar";
import { DepartmentOverview } from "@/components/dashboard/department-overview";
import { PatientDemographics } from "@/components/dashboard/patient-demographics";
import { DashboardHeader } from "@/components/dashboard/page-header";
import { StatCards } from "@/components/dashboard/stat-cards";
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments";
import { AppShell } from "@/components/layout/app-shell";
import { PageContent } from "@/components/layout/page-content";
import styles from "@/components/dashboard/dashboard.module.css";

export default function DashboardPage() {
  return (
    <AppShell>
      <AppHeader />
      <PageContent>
        <div className={styles.dash}>
          <DashboardHeader />
          <StatCards />
          <div className={`${styles.row} ${styles.rowWide}`}>
            <div className={styles.column}>
              <UpcomingAppointments />
              <div className={styles.pair}>
                <AppointmentTrends />
                <PatientDemographics />
              </div>
            </div>
            <div className={styles.column}>
              <AppointmentsCalendar />
              <DepartmentOverview />
            </div>
          </div>
        </div>
      </PageContent>
    </AppShell>
  );
}
