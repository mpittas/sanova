import type { Metadata } from "next";
import { AppHeader } from "@/components/dashboard/app-header";
import { HelpView } from "@/components/help/help-view";
import { AppShell } from "@/components/layout/app-shell";
import { PageContent } from "@/components/layout/page-content";

export const metadata: Metadata = { title: "Help Center", description: "Answers, tips and ways to reach the Sanova team." };

export default function HelpPage() {
  return (
    <AppShell>
      <AppHeader />
      <PageContent>
        <HelpView />
      </PageContent>
    </AppShell>
  );
}
