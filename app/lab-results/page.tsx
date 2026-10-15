import type { Metadata } from "next";
import { AppHeader } from "@/components/dashboard/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { PageContent } from "@/components/layout/page-content";
import { LabResultsView } from "@/components/lab-results/lab-results-view";

export const metadata: Metadata = {
  title: "Lab Results",
  description: "View and analyze lab results, track trends, and monitor patient progress.",
};

export default function LabResultsPage() {
  return (
    <AppShell>
      <AppHeader />
      <PageContent>
        <LabResultsView />
      </PageContent>
    </AppShell>
  );
}
