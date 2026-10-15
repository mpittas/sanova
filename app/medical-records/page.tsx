import type { Metadata } from "next";
import { AppHeader } from "@/components/dashboard/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { PageContent } from "@/components/layout/page-content";
import { MedicalRecordsView } from "@/components/medical-records/medical-records-view";

export const metadata: Metadata = {
  title: "Medical Records",
  description: "View and manage a patient's complete medical history.",
};

export default function MedicalRecordsPage() {
  return (
    <AppShell>
      <AppHeader />
      <PageContent>
        <MedicalRecordsView />
      </PageContent>
    </AppShell>
  );
}
