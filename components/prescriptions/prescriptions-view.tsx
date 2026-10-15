"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { LuChevronRight, LuPill, LuPlus, LuShieldAlert } from "react-icons/lu";
import { SplitLayout } from "@/components/layout/split-layout";
import { PageHeader } from "@/components/layout/page-header";
import { healthFacts, patient } from "@/components/patient-record/data";
import { PatientBanner } from "@/components/patient-record/patient-banner";
import { PatientCrumbs } from "@/components/patient-record/patient-crumbs";
import { RecordNav } from "@/components/patient-record/record-nav";
import patientStyles from "@/components/patient-record/patient-record.module.css";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ToneTile } from "@/components/ui/tone-tile";
import { rangeStart, renew, seedPrescriptions, type Prescription, type Range } from "./data";
import { NewPrescriptionModal } from "./new-prescription-modal";
import { PharmacyModal } from "./pharmacy-modal";
import { PrescriptionDetail } from "./prescription-detail";
import { PrescriptionList } from "./prescription-list";
import styles from "./prescriptions.module.css";

const allergies = healthFacts.find(({ id }) => id === "allergies")!;

export function PrescriptionsView() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(seedPrescriptions);
  const [selectedId, setSelectedId] = useState<string>(seedPrescriptions[0].id);
  const [range, setRange] = useState<Range>("All Time");
  const [newOpen, setNewOpen] = useState(false);
  const [pharmacyOpen, setPharmacyOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(() => {
    const start = rangeStart(range);
    return prescriptions.filter((prescription) => prescription.date >= start).toSorted((a, b) => b.date.localeCompare(a.date));
  }, [prescriptions, range]);

  // If the selected prescription is outside the time range, the first one that is left takes its place.
  const selected = visible.find((prescription) => prescription.id === selectedId) ?? visible[0];

  const select = (id: string) => {
    setSelectedId(id);
    // When the layout stacks (narrow screens) the detail is below the list: bring it into view.
    const top = detailRef.current?.getBoundingClientRect().top ?? 0;
    if (top > window.innerHeight * 0.6) detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const addPrescription = (prescription: Prescription) => {
    setPrescriptions((current) => [prescription, ...current]);
    setSelectedId(prescription.id);
    setRange("All Time");
    setNotice(`${prescription.medication} was prescribed.`);
  };

  const renewSelected = () => {
    if (!selected) return;
    const id = `rx-${Date.now()}`;
    setPrescriptions((current) => renew(current, selected.id, id));
    setSelectedId(id);
    setRange("All Time");
    setNotice(`${selected.medication} was renewed.`);
  };

  const sendSelected = (pharmacy: string) => {
    if (!selected) return;
    setPrescriptions((current) => current.map((prescription) => (prescription.id === selected.id ? { ...prescription, sentTo: pharmacy } : prescription)));
    setNotice(`${selected.medication} was sent to ${pharmacy.split(" · ")[0]}.`);
  };

  return (
    <>
      <PageHeader
        eyebrow={<PatientCrumbs current="Prescriptions" />}
        title="Prescriptions"
        description={`Manage and track all prescriptions for ${patient.name}.`}
        actions={
          <Button iconLeft={<LuPlus />} onClick={() => setNewOpen(true)}>
            New Prescription
          </Button>
        }
      />

      <PatientBanner
        variant="card"
        aside={
          <Link href="/medical-records" className={patientStyles.alert}>
            <ToneTile tone="coral" size={44}>
              <LuShieldAlert />
            </ToneTile>
            <span className={patientStyles.alertText}>
              <span className="text-caption text-muted">{allergies.label}</span>
              <span className="text-label">{allergies.value}</span>
            </span>
            <LuChevronRight aria-hidden />
          </Link>
        }
      />

      <RecordNav current="Prescriptions" />

      <Notice message={notice} onDismiss={() => setNotice(null)} />

      <SplitLayout
        side="lg"
        aside={
          <div ref={detailRef} className={styles.detailWrap}>
            {selected ? (
              <PrescriptionDetail prescription={selected} onRenew={renewSelected} onSend={() => setPharmacyOpen(true)} />
            ) : (
              <Card rounded>
                <EmptyState icon={LuPill} title="No prescription selected" description="Pick a prescription to see its details." />
              </Card>
            )}
          </div>
        }
      >
        <PrescriptionList prescriptions={visible} selectedId={selected?.id} onSelect={select} range={range} onRangeChange={setRange} />
      </SplitLayout>

      <NewPrescriptionModal open={newOpen} onClose={() => setNewOpen(false)} count={prescriptions.length} onAdd={addPrescription} />
      <PharmacyModal open={pharmacyOpen} onClose={() => setPharmacyOpen(false)} medication={selected?.medication ?? "this prescription"} onSend={sendSelected} />
    </>
  );
}
