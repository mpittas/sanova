import type { Metadata } from "next";
import { LuPlus } from "react-icons/lu";
import { AppHeader } from "@/components/dashboard/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";
import { PatientStats } from "@/components/patients/patient-stats";
import { PatientsView } from "@/components/patients/patients-view";
import { Button } from "@/components/ui/button";

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

        <PatientStats />

        <PatientsView />
      </PageContent>
    </AppShell>
  );
}
