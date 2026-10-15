"use client";

import { LuChevronRight, LuSearch, LuSearchX, LuX } from "react-icons/lu";
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
  searchOpen: boolean;
  onSearchOpenChange: (open: boolean) => void;
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
  searchOpen,
  onSearchOpenChange,
  onClear,
}: LabTestListProps) {
  return (
    <Card
      rounded
      title="Lab Tests"
      description="Browse and select a lab test to view detailed results."
      action={
        <div className={styles.listTools}>
          <Button
            variant="secondary"
            iconOnly
            pressed={searchOpen}
            aria-label={searchOpen ? "Close search" : "Search lab tests"}
            aria-expanded={searchOpen}
            aria-controls="lab-search"
            onClick={() => {
              if (searchOpen) onQueryChange("");
              onSearchOpenChange(!searchOpen);
            }}
          >
            {searchOpen ? <LuX /> : <LuSearch />}
          </Button>
          <Select size="md" aria-label="Filter by result" value={status} options={statusFilters} onChange={onStatusChange} />
        </div>
      }
    >
      {searchOpen && (
        <div id="lab-search" className={styles.search}>
          <SearchInput label="Search lab tests" autoFocus value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search lab tests..." />
        </div>
      )}

      {tests.length > 0 ? (
        <ul className={styles.tests} aria-label="Lab tests">
          {tests.map((test) => {
            const result = statusOfTest(test);
            const selected = test.id === selectedId;
            const Icon = test.icon;
            return (
              <li key={test.id}>
                <button type="button" className={styles.test} aria-pressed={selected} data-tone={test.tone} onClick={() => onSelect(test.id)}>
                  <ToneTile tone={test.tone} size={52}>
                    <Icon />
                  </ToneTile>
                  <span className={styles.testText}>
                    <span className="text-small text-muted num">{formatDate(test.date, { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span className="text-label">{test.name}</span>
                    <span className="text-small text-muted">
                      {test.parameters.length} {test.parameters.length === 1 ? "parameter" : "parameters"} • {test.reason}
                    </span>
                  </span>
                  <Chip tone={testStatusMeta[result].chip} variant="tag" size="sm" className={styles.testStatus}>
                    {result}
                  </Chip>
                  <LuChevronRight className={styles.chevron} aria-hidden />
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
    </Card>
  );
}
