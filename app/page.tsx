import { AppHeader } from "@/components/dashboard/app-header";
import { AppointmentTrends } from "@/components/dashboard/appointment-trends";
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
          <div className={styles.row}>
            <UpcomingAppointments />
            <DepartmentOverview />
          </div>
          <div className={styles.row}>
            <AppointmentTrends />
            <PatientDemographics />
          </div>
        </div>
      </PageContent>
    </AppShell>
  );
}
