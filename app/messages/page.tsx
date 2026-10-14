import type { Metadata } from "next";
import { LuPlus } from "react-icons/lu";
import { AppHeader } from "@/components/dashboard/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";
import { MessagesView } from "@/components/messages/messages-view";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Messages",
  description: "Communicate with your patients and care team, all in one place.",
};

export default function MessagesPage() {
  return (
    <AppShell>
      <AppHeader />
      <PageContent>
        <PageHeader
          title="Messages"
          description="Communicate with your patients and care team, all in one place."
          actions={<Button iconLeft={<LuPlus />}>New Message</Button>}
        />
        <MessagesView />
      </PageContent>
    </AppShell>
  );
}
