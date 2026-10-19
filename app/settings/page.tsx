import type { Metadata } from "next";
import { AppHeader } from "@/components/dashboard/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { PageContent } from "@/components/layout/page-content";
import { SettingsView } from "@/components/settings/settings-view";

export const metadata: Metadata = { title: "Settings", description: "Manage your profile, your clinic and your notifications." };

export default function SettingsPage() {
  return (
    <AppShell>
      <AppHeader />
      <PageContent>
        <SettingsView />
      </PageContent>
    </AppShell>
  );
}
