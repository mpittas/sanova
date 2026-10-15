import type { Metadata } from "next";
import { AppHeader } from "@/components/dashboard/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { PageContent } from "@/components/layout/page-content";
import { PrescriptionsView } from "@/components/prescriptions/prescriptions-view";

export const metadata: Metadata = {
  title: "Prescriptions",
  description: "Manage and track all prescriptions for a patient.",
};

export default function PrescriptionsPage() {
  return (
    <AppShell>
      <AppHeader />
      <PageContent>
        <PrescriptionsView />
      </PageContent>
    </AppShell>
  );
}
