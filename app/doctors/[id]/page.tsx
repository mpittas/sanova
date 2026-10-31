import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/dashboard/app-header";
import { doctorById, doctors } from "@/components/doctors/data";
import { DoctorProfile } from "@/components/doctors/doctor-profile";
import { AppShell } from "@/components/layout/app-shell";
import { PageContent } from "@/components/layout/page-content";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return doctors.map((doctor) => ({ id: doctor.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doctor = doctorById((await params).id);
  return {
    title: doctor?.name ?? "Doctor",
    description: doctor ? `${doctor.name}, ${doctor.title}: credentials, availability and patient reviews.` : undefined,
  };
}

export default async function DoctorPage({ params }: Props) {
  const doctor = doctorById((await params).id);
  if (!doctor) notFound();

  return (
    <AppShell>
      <AppHeader />
      <PageContent>
        <DoctorProfile doctor={doctor} />
      </PageContent>
    </AppShell>
  );
}
