import type { Metadata } from "next";
import { LuPlus } from "react-icons/lu";
import { AppointmentStats } from "@/components/appointments/appointment-stats";
import { AppointmentsView } from "@/components/appointments/appointments-view";
import { AppHeader } from "@/components/dashboard/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Appointments",
  description: "View and manage your schedule, appointments, and availability.",
};

export default function AppointmentsPage() {
  return (
    <AppShell>
      <AppHeader />
      <PageContent>
        <PageHeader
          title="Appointments"
          description="View and manage your schedule, appointments, and availability."
          actions={<Button iconLeft={<LuPlus />}>Book Appointment</Button>}
        />
        <AppointmentStats />
        <AppointmentsView />
      </PageContent>
    </AppShell>
  );
}
