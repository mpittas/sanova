import type { Metadata } from "next";
import { AppHeader } from "@/components/dashboard/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { PageContent } from "@/components/layout/page-content";
import { ReportsView } from "@/components/reports/reports-view";

export const metadata: Metadata = { title: "Reports", description: "Visits, revenue, waiting times and patient satisfaction at a glance." };

export default function ReportsPage() {
  return (
    <AppShell>
      <AppHeader />
      <PageContent>
        <ReportsView />
      </PageContent>
    </AppShell>
  );
}
