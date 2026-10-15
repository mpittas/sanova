"use client";

import { useMemo, useRef, useState } from "react";
import { LuFlaskConical } from "react-icons/lu";
import { SplitLayout } from "@/components/layout/split-layout";
import { PageHeader } from "@/components/layout/page-header";
import { PatientBanner } from "@/components/patient-record/patient-banner";
import { PatientCrumbs } from "@/components/patient-record/patient-crumbs";
import { patient } from "@/components/patient-record/data";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { labTests, ranges, rangeStart, statusOfTest, type Range, type StatusFilter } from "./data";
import { LabTestDetail } from "./lab-test-detail";
import { LabTestList } from "./lab-test-list";
import styles from "./lab-results.module.css";

export function LabResultsView() {
  const [range, setRange] = useState<Range>("All Time");
  const [status, setStatus] = useState<StatusFilter>("All Tests");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(labTests[0].id);
  const detailRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const start = rangeStart(range);
    return labTests
      .filter((test) => test.date >= start)
      .filter((test) => status === "All Tests" || statusOfTest(test) === status)
      .filter((test) => !needle || [test.name, test.reason].some((field) => field.toLowerCase().includes(needle)))
      .toSorted((a, b) => b.date.localeCompare(a.date));
  }, [range, status, query]);

  // If the selected test is filtered out, the first one that is left takes its place.
  const selected = visible.find((test) => test.id === selectedId) ?? visible[0];

  const select = (id: string) => {
    setSelectedId(id);
    // When the layout stacks (narrow screens) the detail is below the list: bring it into view.
    const top = detailRef.current?.getBoundingClientRect().top ?? 0;
    if (top > window.innerHeight * 0.6) detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearFilters = () => {
    setStatus("All Tests");
    setQuery("");
    setSearchOpen(false);
    setRange("All Time");
  };

  return (
    <>
      <PageHeader
        eyebrow={<PatientCrumbs current="Lab Results" />}
        title="Lab Results"
        description="View and analyze lab results, track trends, and monitor patient progress."
        actions={<Select size="md" aria-label="Time range" value={range} options={ranges} onChange={setRange} />}
      />

      <PatientBanner variant="card" tagline="Tracking progress for a healthier tomorrow." />

      <SplitLayout
        columns="minmax(0, 5fr) minmax(0, 7fr)"
        aside={
          <div ref={detailRef} className={styles.detailWrap}>
            {selected ? (
              // Keyed by test, so the tab and the trend parameter start fresh for each one.
              <LabTestDetail key={selected.id} test={selected} />
            ) : (
              <Card rounded>
                <EmptyState icon={LuFlaskConical} title="No test selected" description={`Pick a lab test to see the results for ${patient.name}.`} />
              </Card>
            )}
          </div>
        }
      >
        <LabTestList
          tests={visible}
          selectedId={selected?.id}
          onSelect={select}
          status={status}
          onStatusChange={setStatus}
          query={query}
          onQueryChange={setQuery}
          searchOpen={searchOpen}
          onSearchOpenChange={setSearchOpen}
          onClear={clearFilters}
        />
      </SplitLayout>
    </>
  );
}
