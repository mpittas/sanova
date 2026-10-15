"use client";

import { useMemo, useState } from "react";
import { LuDownload, LuEllipsis, LuMessageSquare, LuSlidersHorizontal, LuX } from "react-icons/lu";
import { formatDate, formatTime } from "@/components/appointments/dates";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Chip, type ChipTone } from "@/components/ui/chip";
import { Counter } from "@/components/ui/counter";
import { FilterBar, FilterField, FilterPanel } from "@/components/ui/filter-bar";
import { NoResults } from "@/components/ui/no-results";
import { ResultsFooter } from "@/components/ui/results-footer";
import { SearchInput } from "@/components/ui/search-input";
import { Person } from "@/components/ui/person";
import { Select } from "@/components/ui/select";
import { Table, Th } from "@/components/ui/table";
import { usePagination } from "@/lib/use-pagination";
import { ageOn, patients, providers, type Patient, type PatientStatus } from "./data";
import styles from "./patients.module.css";

const statusOptions = ["All Statuses", "Active", "Inactive", "At Risk", "New"] as const;
const providerOptions = ["All Providers", ...providers] as const;
const appointmentOptions = ["Any appointment", "Has upcoming", "None scheduled"] as const;
const ageOptions = ["Any age", "Under 30", "30–49", "50 and over"] as const;
const pageSizeOptions = ["6 per page", "10 per page", "25 per page"] as const;

type SortKey = "name" | "dob" | "lastVisit" | "next";
type Sort = { key: SortKey; direction: "asc" | "desc" } | null;

const statusTone: Record<PatientStatus, ChipTone> = {
  Active: "success",
  Inactive: "neutral",
  "At Risk": "danger",
};

const columns: { key: SortKey | null; label: string }[] = [
  { key: "name", label: "Patient" },
  { key: "dob", label: "Date of Birth" },
  { key: null, label: "Contact" },
  { key: "lastVisit", label: "Last Visit" },
  { key: "next", label: "Next Appointment" },
  { key: null, label: "Status" },
];

const shortDate = (iso: string) => formatDate(iso, { month: "short", day: "numeric", year: "numeric" });

function compare(a: Patient, b: Patient, key: SortKey) {
  switch (key) {
    case "name":
      return a.name.localeCompare(b.name);
    case "dob":
      return a.dob.localeCompare(b.dob);
    case "lastVisit":
      return a.lastVisit.localeCompare(b.lastVisit);
    case "next":
      return `${a.next?.date}${a.next?.time}`.localeCompare(`${b.next?.date}${b.next?.time}`);
  }
}

export function PatientsView() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("All Statuses");
  const [provider, setProvider] = useState<(typeof providerOptions)[number]>("All Providers");
  const [appointment, setAppointment] = useState<(typeof appointmentOptions)[number]>("Any appointment");
  const [age, setAge] = useState<(typeof ageOptions)[number]>("Any age");
  const [moreOpen, setMoreOpen] = useState(false);
  const [sort, setSort] = useState<Sort>(null);
  const [pageSize, setPageSize] = useState<(typeof pageSizeOptions)[number]>("6 per page");
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());

  const extraFilters = (appointment !== "Any appointment" ? 1 : 0) + (age !== "Any age" ? 1 : 0);
  const hasFilters = query !== "" || status !== "All Statuses" || provider !== "All Providers" || extraFilters > 0;

  /** Changing a filter always returns to the first page. */
  const filter = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    reset();
  };

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const rows = patients.filter((patient) => {
      if (needle && ![patient.name, patient.mrn, patient.phone, patient.email].some((field) => field.toLowerCase().includes(needle))) return false;
      if (status === "New" ? !patient.isNew : status !== "All Statuses" && patient.status !== status) return false;
      if (provider !== "All Providers" && patient.provider !== provider) return false;
      if (appointment === "Has upcoming" && !patient.next) return false;
      if (appointment === "None scheduled" && patient.next) return false;
      if (age !== "Any age") {
        const years = ageOn(patient.dob);
        if (age === "Under 30" && years >= 30) return false;
        if (age === "30–49" && (years < 30 || years > 49)) return false;
        if (age === "50 and over" && years < 50) return false;
      }
      return true;
    });

    if (!sort) return rows;
    const factor = sort.direction === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      // Patients without a value (no next appointment) always go last.
      if (sort.key === "next" && (!a.next || !b.next)) return Number(!a.next) - Number(!b.next);
      return compare(a, b, sort.key) * factor;
    });
  }, [query, status, provider, appointment, age, sort]);

  const { page, setPage, reset, totalPages, firstIndex, visible: rows, total } = usePagination(filtered, Number.parseInt(pageSize, 10));

  const selectedOnPage = rows.filter((patient) => selected.has(patient.id)).length;
  const allOnPage = rows.length > 0 && selectedOnPage === rows.length;

  const toggleRow = (id: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const togglePage = () =>
    setSelected((current) => {
      const next = new Set(current);
      for (const patient of rows) {
        if (allOnPage) next.delete(patient.id);
        else next.add(patient.id);
      }
      return next;
    });

  const cycleSort = (key: SortKey) =>
    setSort((current) => {
      if (current?.key !== key) return { key, direction: "asc" };
      return current.direction === "asc" ? { key, direction: "desc" } : null;
    });

  const clearFilters = () => {
    setQuery("");
    setStatus("All Statuses");
    setProvider("All Providers");
    setAppointment("Any appointment");
    setAge("Any age");
    reset();
  };

  return (
    <Card padding="none">
      <FilterBar inset>
        <SearchInput
          label="Search patients"
          value={query}
          onChange={(event) => filter(setQuery)(event.target.value)}
          placeholder="Search patients by name, phone, email, or medical record number..."
          tone="white"
        />
        <Select size="md" aria-label="Filter by status" value={status} options={statusOptions} onChange={filter(setStatus)} />
        <Select size="md" aria-label="Filter by provider" value={provider} options={providerOptions} onChange={filter(setProvider)} />
        <Button
          variant="secondary"
          iconLeft={<LuSlidersHorizontal />}
          pressed={moreOpen}
          aria-expanded={moreOpen}
          aria-controls="more-filters"
          onClick={() => setMoreOpen((open) => !open)}
        >
          More Filters
          {extraFilters > 0 && <Counter>{extraFilters}</Counter>}
        </Button>
      </FilterBar>

      {moreOpen && (
        <FilterPanel id="more-filters" inset onReset={clearFilters} canReset={hasFilters}>
          <FilterField label="Next appointment">
            <Select size="md" aria-label="Filter by next appointment" value={appointment} options={appointmentOptions} onChange={filter(setAppointment)} />
          </FilterField>
          <FilterField label="Age">
            <Select size="md" aria-label="Filter by age" value={age} options={ageOptions} onChange={filter(setAge)} />
          </FilterField>
        </FilterPanel>
      )}

      {selected.size > 0 && (
        <div className={styles.bulk} role="status">
          <span className="text-label">{selected.size} selected</span>
          <span className="spacer" />
          <Button variant="secondary" size="sm" iconLeft={<LuMessageSquare />}>
            Message
          </Button>
          <Button variant="secondary" size="sm" iconLeft={<LuDownload />}>
            Export
          </Button>
          <Button variant="ghost" size="sm" iconLeft={<LuX />} onClick={() => setSelected(new Set())}>
            Clear
          </Button>
        </div>
      )}

      <Table variant="banded" minWidth={980}>
        <thead>
          <tr>
            <th className="table-check">
              <Checkbox
                aria-label="Select all patients on this page"
                checked={allOnPage}
                indeterminate={selectedOnPage > 0 && !allOnPage}
                disabled={rows.length === 0}
                onChange={togglePage}
              />
            </th>
            {columns.map(({ key, label }) => (
              <Th
                key={label}
                sort={key ? { direction: sort?.key === key ? sort.direction : null, onSort: () => cycleSort(key) } : undefined}
              >
                {label}
              </Th>
            ))}
            <th className="table-actions">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((patient) => {
            const isSelected = selected.has(patient.id);
            return (
              <tr key={patient.id} data-selected={isSelected || undefined}>
                <td className="table-check">
                  <Checkbox aria-label={`Select ${patient.name}`} checked={isSelected} onChange={() => toggleRow(patient.id)} />
                </td>
                <td>
                  <Person name={patient.name} src={patient.photo} subtitle={`MRN: ${patient.mrn}`} />
                </td>
                <td>
                  <span className="text-stack">
                    <span className="num">{shortDate(patient.dob)}</span>
                    <span className="text-small text-muted">({ageOn(patient.dob)} years)</span>
                  </span>
                </td>
                <td>
                  <span className="text-stack">
                    <span className="num">{patient.phone}</span>
                    <span className="text-small text-muted">{patient.email}</span>
                  </span>
                </td>
                <td className={`num ${styles.muted}`}>{shortDate(patient.lastVisit)}</td>
                <td>
                  {patient.next ? (
                    <span className="text-stack">
                      <span className="num">{shortDate(patient.next.date)}</span>
                      <span className="text-small text-muted num">{formatTime(patient.next.time)}</span>
                    </span>
                  ) : (
                    <span className="text-subtle" aria-label="None scheduled">
                      —
                    </span>
                  )}
                </td>
                <td>
                  <Chip tone={statusTone[patient.status]}>{patient.status}</Chip>
                </td>
                <td className="table-actions">
                  <Button variant="ghost" size="sm" iconOnly aria-label={`More actions for ${patient.name}`}>
                    <LuEllipsis />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {rows.length === 0 && <NoResults title="No patients found" onClear={clearFilters} />}

      <ResultsFooter inset firstIndex={firstIndex} shown={rows.length} total={total} noun={["patient", "patients"]} page={page} totalPages={totalPages} onPageChange={setPage}>
        <Select aria-label="Rows per page" value={pageSize} options={pageSizeOptions} onChange={filter(setPageSize)} />
      </ResultsFooter>
    </Card>
  );
}
