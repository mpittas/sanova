"use client";

import { LuArrowUpRight, LuSearchX } from "react-icons/lu";
import { formatDate } from "@/components/appointments/dates";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { ToneTile } from "@/components/ui/tone-tile";
import { statusFilters, statusOfTest, testStatusMeta, type LabTest, type StatusFilter } from "./data";
import styles from "./lab-results.module.css";

type LabTestListProps = {
  tests: readonly LabTest[];
  selectedId: string | undefined;
  onSelect: (id: string) => void;
  status: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  query: string;
  onQueryChange: (query: string) => void;
  onClear: () => void;
};

export function LabTestList({
  tests,
  selectedId,
  onSelect,
  status,
  onStatusChange,
  query,
  onQueryChange,
  onClear,
}: LabTestListProps) {
  return (
    <Card
      rounded
      padding="none"
      className={styles.listCard}
    >
      <header className={styles.listHeader}><div><h2>Lab tests <span>{tests.length}</span></h2><p>Your patient’s results, in one place.</p></div><Select size="sm" aria-label="Filter by result" value={status} options={statusFilters} onChange={onStatusChange} /></header>
      <div className={styles.search}><SearchInput label="Search lab tests" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search tests or reason…" /></div>

      {tests.length > 0 ? (
        <ul className={styles.tests} aria-label="Lab tests">
          {tests.map((test) => {
            const result = statusOfTest(test);
            const selected = test.id === selectedId;
            const Icon = test.icon;
            return (
              <li key={test.id}>
                <button type="button" className={styles.test} aria-pressed={selected} data-tone={test.tone} onClick={() => onSelect(test.id)}>
                  <ToneTile tone={test.tone} size={40}>
                    <Icon />
                  </ToneTile>
                  <span className={styles.testText}>
                    <strong>{test.name}</strong>
                    <span className="text-small text-muted">
                      {test.reason}
                    </span>
                  </span>
                  <LuArrowUpRight className={styles.chevron} aria-hidden />
                  <span className={styles.testFooter}>
                  <Chip tone={testStatusMeta[result].chip} variant="tag" size="sm">
                    {result}
                  </Chip>
                  <span>{test.parameters.length} {test.parameters.length === 1 ? "marker" : "markers"}</span><time dateTime={test.date}>{formatDate(test.date, { month: "short", day: "numeric", year: "numeric" })}</time>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          icon={LuSearchX}
          size="compact"
          title="No lab tests found"
          description="Try a different search, result filter or time range."
          action={
            <Button variant="secondary" size="sm" onClick={onClear}>
              Clear filters
            </Button>
          }
        />
      )}
      <footer className={styles.listFooter}>{tests.length} {tests.length === 1 ? "test" : "tests"} · Newest first</footer>
    </Card>
  );
}
