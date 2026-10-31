"use client";

import styles from "./medical-records.module.css";
import { useEffect, useMemo, useState } from "react";
import { LuMail, LuPhone, LuPlus, LuSearch, LuX } from "react-icons/lu";
import { PageHeader } from "@/components/layout/page-header";
import { patient } from "@/components/patient-record/data";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { PatientCrumbs } from "@/components/patient-record/patient-crumbs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { ActivityTimeline } from "./activity-timeline";
import { PatientBanner } from "./patient-banner";
import { AddRecordModal } from "./add-record-modal";
import {
  documents,
  ranges,
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
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const visible = useMemo(() => {
    if (tab === "Documents") return [];
    const types = tabTypes[tab];
    const start = rangeStart(range);
    return records.filter((record) => types.includes(record.type) && record.date >= start && [record.title, record.source, record.summary, record.subtitle].some((value) => value?.toLowerCase().includes(query.trim().toLowerCase()))).toSorted((a, b) => b.date.localeCompare(a.date));
  }, [records, tab, range, query]);

  const addRecord = (record: MedicalRecord) => {
    setRecords((current) => [...current, record]);
    setNotice(`\u201c${record.title}\u201d was added to the record.`);
    // Show the new record: go to the overview, unfiltered.
    setTab("Overview");
    setRange("All Time");
    setQuery("");
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

      <div className={styles.workspace}>
        <Card rounded padding="none" className={styles.recordWorkspace} aria-label="Patient records">
          <div className={styles.workspaceHeading}>
            {searchOpen ? <SearchInput autoFocus wrapperClassName={styles.headerSearch} label="Search patient records" placeholder={tab === "Documents" ? "Search documents..." : "Search records, clinicians or notes..."} value={query} onChange={(event) => setQuery(event.target.value)} /> : <h2>Patient records <span className={styles.recordCount} aria-label={`${records.length} records`}>{records.length}</span></h2>}
            <div className={styles.headerTools}>
              <button type="button" className={styles.searchToggle} aria-label={searchOpen ? "Close search" : "Search patient records"} aria-expanded={searchOpen} onClick={() => { if (searchOpen) setQuery(""); setSearchOpen(!searchOpen); }}>{searchOpen ? <LuX /> : <LuSearch />}</button>
              <Select size="md" aria-label="Record type" value={tab} options={tabs} onChange={setTab} />
              <Select size="md" aria-label="Time range" value={range} options={ranges} onChange={setRange} />
            </div>
          </div>
          {(query || range !== "All Time") && <div className={styles.filterSummary}><span className="text-small text-muted">Filters applied</span><Button variant="ghost" size="sm" onClick={() => { setQuery(""); setRange("All Time"); }}>Clear filters</Button></div>}
          {tab === "Documents" ? (
            <DocumentsCard title="Documents" description={tabDescriptions.Documents} documents={documents.filter((doc) => doc.name.toLowerCase().includes(query.trim().toLowerCase()) && doc.date >= rangeStart(range)).toSorted((a,b) => b.date.localeCompare(a.date))} />
          ) : (
            <ActivityTimeline title={tab === "Overview" ? "Record timeline" : tab} description={`${visible.length} ${visible.length === 1 ? "record" : "records"} · Newest first`} records={visible} range={range} onRangeChange={setRange} />
          )}
        </Card>
        <aside className={styles.contextRail} aria-label="Health and documents">
          <HealthInfo />
          {tab !== "Documents" && <DocumentsCard title="Recent documents" documents={documents.toSorted((a,b) => b.date.localeCompare(a.date)).slice(0, 3)} onViewAll={() => {setTab("Documents"); setQuery(""); setRange("All Time");}} />}
          <Card rounded className={styles.contactCard} aria-label="Patient contact">
            <h2 className="text-label">Patient contact</h2>
            <a href={`tel:${patient.phone.replaceAll(" ", "")}`}>
              <LuPhone aria-hidden />
              {patient.phone}
            </a>
            <a href={`mailto:${patient.email}`}>
              <LuMail aria-hidden />
              {patient.email}
            </a>
          </Card>
        </aside>
      </div>
      <AddRecordModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={addRecord} />
    </>
  );
}

