import type { Metadata } from "next";
import { LuPlus } from "react-icons/lu";
import { AppHeader } from "@/components/dashboard/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { MessagesView } from "@/components/messages/messages-view";
import { Button } from "@/components/ui/button";
import styles from "@/components/messages/messages.module.css";

export const metadata: Metadata = {
  title: "Messages",
  description: "Communicate with your patients and care team, all in one place.",
};

export default function MessagesPage() {
  return (
    <AppShell>
      <AppHeader />
      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className="text-h1">Messages</h1>
            <p className="text-body-lg text-muted">Communicate with your patients and care team, all in one place.</p>
          </div>
          <Button iconLeft={<LuPlus />}>New Message</Button>
        </div>

        <MessagesView />
      </main>
    </AppShell>
  );
}
