import type { Metadata } from "next";
import { AppHeader } from "@/components/dashboard/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { PageContent } from "@/components/layout/page-content";
import { TelemedicineView } from "@/components/telemedicine/telemedicine-view";

export const metadata: Metadata = {
  title: "Telemedicine",
  description: "Connect with your patients through secure virtual consultations.",
};

export default function TelemedicinePage() {
  return (
    <AppShell>
      <AppHeader />
      <PageContent>
        <TelemedicineView />
      </PageContent>
    </AppShell>
  );
}
