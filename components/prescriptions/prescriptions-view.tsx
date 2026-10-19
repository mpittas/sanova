"use client";

import { useMemo, useRef, useState } from "react";
import { LuPill, LuPlus } from "react-icons/lu";
import { PageHeader } from "@/components/layout/page-header";
import { patient } from "@/components/patient-record/data";
import { PatientBanner } from "@/components/medical-records/patient-banner";
import { PatientCrumbs } from "@/components/patient-record/patient-crumbs";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { rangeStart, renew, seedPrescriptions, type Prescription, type Range } from "./data";
import { NewPrescriptionModal } from "./new-prescription-modal";
import { PharmacyModal } from "./pharmacy-modal";
import { PrescriptionDetail } from "./prescription-detail";
import { PrescriptionList } from "./prescription-list";
import styles from "./prescriptions.module.css";

export function PrescriptionsView() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(seedPrescriptions);
  const [selectedId, setSelectedId] = useState<string>(seedPrescriptions[0].id);
  const [range, setRange] = useState<Range>("All Time");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [newOpen, setNewOpen] = useState(false);
  const [pharmacyOpen, setPharmacyOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(() => {
    const start = rangeStart(range);
    const needle = query.trim().toLowerCase();
    return prescriptions.filter((prescription) => prescription.date >= start && (status === "All" || prescription.status === status) && `${prescription.medication} ${prescription.prescriber} ${prescription.indication}`.toLowerCase().includes(needle)).toSorted((a, b) => b.date.localeCompare(a.date));
  }, [prescriptions, range, query, status]);

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
    setQuery("");
    setStatus("All");
    setNotice(`${prescription.medication} was prescribed.`);
  };

  const renewSelected = () => {
    if (!selected) return;
    const id = `rx-${Date.now()}`;
    setPrescriptions((current) => renew(current, selected.id, id));
    setSelectedId(id);
    setRange("All Time");
    setQuery("");
    setStatus("All");
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

      <PatientBanner />

      <Notice message={notice} onDismiss={() => setNotice(null)} />

      <div className={styles.workspace}>
        <PrescriptionList prescriptions={visible} allPrescriptions={prescriptions} selectedId={selected?.id} onSelect={select} range={range} onRangeChange={setRange} query={query} onQueryChange={setQuery} status={status} onStatusChange={setStatus} />
          <div ref={detailRef} className={styles.detailWrap}>
            {selected ? (
              <PrescriptionDetail prescription={selected} onRenew={renewSelected} onSend={() => setPharmacyOpen(true)} />
            ) : (
              <Card rounded>
                <EmptyState icon={LuPill} title="No prescription selected" description="Pick a prescription to see its details." />
              </Card>
            )}
          </div>
      </div>

      <NewPrescriptionModal open={newOpen} onClose={() => setNewOpen(false)} count={prescriptions.length} onAdd={addPrescription} />
      <PharmacyModal open={pharmacyOpen} onClose={() => setPharmacyOpen(false)} medication={selected?.medication ?? "this prescription"} onSend={sendSelected} />
    </>
  );
}
