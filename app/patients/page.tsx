import type { Metadata } from "next";
import { LuPlus } from "react-icons/lu";
import { AppHeader } from "@/components/dashboard/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { patientStats } from "@/components/patients/data";
import { PatientsView } from "@/components/patients/patients-view";
import { Button } from "@/components/ui/button";
import { StatGrid, StatTile } from "@/components/ui/stat-tile";
import styles from "@/components/patients/patients.module.css";

export const metadata: Metadata = {
  title: "Patients",
  description: "Manage your patients, view records, and keep track of their care.",
};

export default function PatientsPage() {
  return (
    <AppShell>
      <AppHeader />
      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className="text-h1">Patients</h1>
            <p className="text-body-lg text-muted">Manage your patients, view records, and keep track of their care.</p>
          </div>
          <Button iconLeft={<LuPlus />}>Add Patient</Button>
        </div>

        <StatGrid>
          {patientStats.map(({ id, ...stat }) => (
            <StatTile key={id} {...stat} />
          ))}
        </StatGrid>

        <PatientsView />
      </main>
    </AppShell>
  );
}
