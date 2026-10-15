import type { Metadata } from "next";
import { AppHeader } from "@/components/dashboard/app-header";
import { DepartmentsView } from "@/components/departments/departments-view";
import { AppShell } from "@/components/layout/app-shell";
import { PageContent } from "@/components/layout/page-content";

export const metadata: Metadata = {
  title: "Departments",
  description: "Organize and manage your clinic's departments, services, and care teams.",
};

export default function DepartmentsPage() {
  return (
    <AppShell>
      <AppHeader />
      <PageContent>
        <DepartmentsView />
      </PageContent>
    </AppShell>
  );
}
