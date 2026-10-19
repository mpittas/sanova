import type { Metadata } from "next";
import { AppHeader } from "@/components/dashboard/app-header";
import { ArtOptions } from "@/components/departments/art-options";
import { AppShell } from "@/components/layout/app-shell";
import { PageContent } from "@/components/layout/page-content";

export const metadata: Metadata = {
  title: "Department artwork",
  description: "Backdrop and composition options for the department cards.",
};

export default function DepartmentArtPage() {
  return (
    <AppShell>
      <AppHeader />
      <PageContent>
        <ArtOptions />
      </PageContent>
    </AppShell>
  );
}
