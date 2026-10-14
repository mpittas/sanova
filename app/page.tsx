import { AppHeader } from "@/components/dashboard/app-header";
import { AppointmentTrends } from "@/components/dashboard/appointment-trends";
import { DepartmentOverview } from "@/components/dashboard/department-overview";
import { PatientDemographics } from "@/components/dashboard/patient-demographics";
import { PatientStatistics } from "@/components/dashboard/patient-statistics";
import { DashboardHeader } from "@/components/dashboard/page-header";
import { QuickActions } from "@/components/dashboard/quick-actions";
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
        <DashboardHeader />
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
      </PageContent>
    </AppShell>
  );
}
