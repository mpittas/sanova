import type { Metadata } from "next";
import { LuPlus } from "react-icons/lu";
import { AppHeader } from "@/components/dashboard/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";
import { patientStats } from "@/components/patients/data";
import { PatientsView } from "@/components/patients/patients-view";
import { Button } from "@/components/ui/button";
import { StatGrid, StatTile } from "@/components/ui/stat-tile";

export const metadata: Metadata = {
  title: "Patients",
  description: "Manage your patients, view records, and keep track of their care.",
};

export default function PatientsPage() {
  return (
    <AppShell>
      <AppHeader />
      <PageContent>
        <PageHeader
          title="Patients"
          description="Manage your patients, view records, and keep track of their care."
          actions={<Button iconLeft={<LuPlus />}>Add Patient</Button>}
        />

        <StatGrid>
          {patientStats.map(({ id, ...stat }) => (
            <StatTile key={id} {...stat} />
          ))}
        </StatGrid>

        <PatientsView />
      </PageContent>
    </AppShell>
  );
}
