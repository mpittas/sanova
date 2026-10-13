import { AppHeader } from "@/components/dashboard/app-header";
import { AppointmentTrends } from "@/components/dashboard/appointment-trends";
import { DepartmentOverview } from "@/components/dashboard/department-overview";
import { PatientDemographics } from "@/components/dashboard/patient-demographics";
import { PatientStatistics } from "@/components/dashboard/patient-statistics";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { StatCards } from "@/components/dashboard/stat-cards";
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments";
import { PageHeader } from "@/components/dashboard/page-header";
import { AppShell } from "@/components/layout/app-shell";
import styles from "@/components/dashboard/dashboard.module.css";

export default function DashboardPage() {
  return (
    <AppShell>
      <AppHeader />
      <main className={styles.content}>
        <PageHeader />
        <StatCards />
        <div className={styles.row3}>
          <UpcomingAppointments />
          <PatientStatistics />
          <DepartmentOverview />
        </div>
        <div className={styles.row4}>
          <PatientDemographics />
          <AppointmentTrends />
          <QuickActions />
        </div>
      </main>
    </AppShell>
  );
}
