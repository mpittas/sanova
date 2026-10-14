import type { Metadata } from "next";
import { AppHeader } from "@/components/dashboard/app-header";
import { DoctorsView } from "@/components/doctors/doctors-view";
import { AppShell } from "@/components/layout/app-shell";
import { PageContent } from "@/components/layout/page-content";

export const metadata: Metadata = {
  title: "Doctors",
  description: "Meet your medical team and manage their information, availability, and schedules.",
};

export default function DoctorsPage() {
  return (
    <AppShell>
      <AppHeader />
      <PageContent>
        <DoctorsView />
      </PageContent>
    </AppShell>
  );
}
