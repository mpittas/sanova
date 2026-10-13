import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { SidebarProvider } from "./sidebar-context";
import styles from "./sidebar.module.css";

/** Sidebar + content column. Wrap any page that should have the app navigation. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className={styles.shell}>
        <Sidebar />
        <div className={styles.main}>{children}</div>
      </div>
    </SidebarProvider>
  );
}
