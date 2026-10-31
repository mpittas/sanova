import type { Metadata } from "next";
import { AppHeader } from "@/components/dashboard/app-header";
import { CareTeamBanners } from "@/components/doctors/care-team-banners";
import { doctors } from "@/components/doctors/data";
import { DoctorBanners } from "@/components/doctors/doctor-banners";
import { SpecialtyBubbles } from "@/components/doctors/specialty-bubbles";
import { AppShell } from "@/components/layout/app-shell";
import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";
import { TeamBanners } from "@/components/doctors/team-banners";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Banner options",
  description: "Alternative designs for the Your care team banner on the Doctors page.",
};

export default function DemoBannerPage() {
  return (
    <AppShell>
      <AppHeader />
      <PageContent>
        <PageHeader
          title="Care team banner options"
          description="Thirteen compact designs for the banner at the top of Doctors, each borrowing an object or place from the clinic instead of laying out faces again."
        />
        <section className={styles.featured} aria-label="Living circles">
          <p className={styles.caption}><span className={styles.badge}>New</span><span className="text-label">Living circles</span></p>
          <p className="text-small text-muted">One pastel circle per specialty, its area following the headcount, spread across the banner. The circles sit still until you touch them: hover one and it swells on a soft spring while the others yield, and its face changes to say who is inside. Drag one and it springs back; click to pick a specialty.</p>
          <SpecialtyBubbles title="Your care team" summary={`${doctors.length} doctors across ${new Set(doctors.map((doctor) => doctor.specialty)).size} specialties.`} doctors={doctors} />
        </section>
        <TeamBanners />
        <details className={styles.earlier}>
          <summary>Show the earlier rounds</summary>
          <div className={styles.rounds}>
            <CareTeamBanners />
            <DoctorBanners />
          </div>
        </details>
      </PageContent>
    </AppShell>
  );
}
