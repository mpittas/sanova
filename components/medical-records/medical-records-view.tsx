"use client";

import { SplitLayout } from "@/components/layout/split-layout";
import { useEffect, useMemo, useState } from "react";
import { LuCalendarCheck, LuClipboardList, LuClock, LuFileText, LuFlaskConical, LuImage, LuPill, LuPlus } from "react-icons/lu";
import { PageHeader } from "@/components/layout/page-header";
import { patient } from "@/components/patient-record/data";
import { PatientBanner } from "@/components/patient-record/patient-banner";
import { PatientCrumbs } from "@/components/patient-record/patient-crumbs";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { tabId, Tabs } from "@/components/ui/tabs";
import { ActivityTimeline } from "./activity-timeline";
import { AddRecordModal } from "./add-record-modal";
import {
  documents,
  LATEST_DOCUMENTS,
  rangeStart,
  seedRecords,
  tabDescriptions,
  tabs,
  tabTypes,
  type MedicalRecord,
  type Range,
  type RecordTab,
} from "./data";
import { DocumentsCard } from "./documents-card";
import { HealthInfo } from "./health-info";

const PANEL_ID = "record-panel";

const tabIcons = {
  Overview: <LuCalendarCheck aria-hidden />,
  "Medical History": <LuClipboardList aria-hidden />,
  Visits: <LuClock aria-hidden />,
  Prescriptions: <LuPill aria-hidden />,
  "Lab Results": <LuFlaskConical aria-hidden />,
  Imaging: <LuImage aria-hidden />,
  Documents: <LuFileText aria-hidden />,
} satisfies Record<RecordTab, React.ReactNode>;

/** Other pages link to a section with `/medical-records#<section>`. */
const hashTabs: Record<string, RecordTab> = {
  "medical-history": "Medical History",
  visits: "Visits",
  imaging: "Imaging",
  documents: "Documents",
};

export function MedicalRecordsView() {
  const [records, setRecords] = useState<MedicalRecord[]>(seedRecords);
  const [tab, setTab] = useState<RecordTab>("Overview");
  const [range, setRange] = useState<Range>("All Time");
  const [addOpen, setAddOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const visible = useMemo(() => {
    if (tab === "Documents") return [];
    const types = tabTypes[tab];
    const start = rangeStart(range);
    return records.filter((record) => types.includes(record.type) && record.date >= start).toSorted((a, b) => b.date.localeCompare(a.date));
  }, [records, tab, range]);

  const addRecord = (record: MedicalRecord) => {
    setRecords((current) => [...current, record]);
    setNotice(`\u201c${record.title}\u201d was added to the record.`);
    // Show the new record: go to the overview, unfiltered.
    setTab("Overview");
    setRange("All Time");
  };

  // Open on the section named in the URL, and follow it if it changes while the page is open.
  useEffect(() => {
    const apply = () => {
      const next = hashTabs[window.location.hash.slice(1)];
      if (next) setTab(next);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  return (
    <>
      <PageHeader
        eyebrow={<PatientCrumbs current="Medical Records" />}
        title="Medical Records"
        description={`View and manage the complete medical history for ${patient.name}.`}
        actions={
          <Button iconLeft={<LuPlus />} onClick={() => setAddOpen(true)}>
            Add Record
          </Button>
        }
      />

      <PatientBanner />

      <Notice message={notice} onDismiss={() => setNotice(null)} />

      <Tabs aria-label="Record sections" panelId={PANEL_ID} value={tab} options={tabs} icons={tabIcons} onChange={setTab} />

      <SplitLayout
        side="md"
        sideLabel="Patient summary"
        aside={
          <>
            <HealthInfo />
            {tab !== "Documents" && (
              <DocumentsCard
                title="Latest Documents"
                documents={documents.slice(0, LATEST_DOCUMENTS)}
                onViewAll={() => setTab("Documents")}
              />
            )}
          </>
        }
      >
        {tab === "Documents" ? (
          <DocumentsCard
            title="Documents"
            description={tabDescriptions.Documents}
            documents={documents}
            panel={{ id: PANEL_ID, labelledBy: tabId(PANEL_ID, tab) }}
          />
        ) : (
          <ActivityTimeline
            title={tab === "Overview" ? "Recent Activity" : tab}
            description={tabDescriptions[tab]}
            records={visible}
            range={range}
            onRangeChange={setRange}
            panelId={PANEL_ID}
            labelledBy={tabId(PANEL_ID, tab)}
          />
        )}
      </SplitLayout>

      <AddRecordModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={addRecord} />
    </>
  );
}
