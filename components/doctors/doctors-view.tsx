"use client";

import { useMemo, useState } from "react";
import { LuPlus, LuSlidersHorizontal } from "react-icons/lu";
import { TODAY } from "@/components/appointments/data";
import { PageHeader } from "@/components/layout/page-header";
import { SplitLayout } from "@/components/layout/split-layout";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { ArchLineup, PageBanner } from "@/components/ui/page-banner";
import { Counter } from "@/components/ui/counter";
import { FilterBar, FilterField, FilterPanel } from "@/components/ui/filter-bar";
import { FilterChips } from "@/components/ui/filter-chips";
import { NoResults } from "@/components/ui/no-results";
import { ResultsFooter } from "@/components/ui/results-footer";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { usePagination } from "@/lib/use-pagination";
import { AddDoctorModal } from "./add-doctor-modal";
import { doctorByName, doctors as seedDoctors, specialties, type Doctor, type Specialty } from "./data";
import { DoctorCard } from "./doctor-card";
import { DoctorSchedule } from "./doctor-schedule";
import { SpecialtyDistribution } from "./specialty-distribution";
import { TeamOverview } from "./team-overview";
import styles from "./doctors.module.css";

type SpecialtyFilter = "All Doctors" | Specialty;

const statusOptions = ["All Statuses", "Active", "On Leave"] as const;
const slotOptions = ["Any time", "Available today"] as const;
const PAGE_SIZE = 6;

const lineup = ["Dr. Olivia Bennett", "Dr. Noah Wilson", "Dr. Liam Carter"].map((name) => doctorByName(name)!.photo);

export function DoctorsView() {
  const [team, setTeam] = useState<Doctor[]>(seedDoctors);
  const [addOpen, setAddOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [specialty, setSpecialty] = useState<SpecialtyFilter>("All Doctors");
  const [query, setQuery] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("All Statuses");
  const [slot, setSlot] = useState<(typeof slotOptions)[number]>("Any time");

  const extraFilters = (status !== "All Statuses" ? 1 : 0) + (slot !== "Any time" ? 1 : 0);
  const hasFilters = specialty !== "All Doctors" || query !== "" || extraFilters > 0;

  const chipOptions = useMemo(
    () =>
      (["All Doctors", ...specialties] as SpecialtyFilter[]).map((value) => ({
        value,
        count: value === "All Doctors" ? team.length : team.filter((doctor) => doctor.specialty === value).length,
      })),
    [team],
  );

  /** Changing a filter always returns to the first page. */
  const filter = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    reset();
  };

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return team.filter((doctor) => {
      if (specialty !== "All Doctors" && doctor.specialty !== specialty) return false;
      if (needle && ![doctor.name, doctor.title, doctor.specialty].some((field) => field.toLowerCase().includes(needle))) return false;
      if (status !== "All Statuses" && doctor.status !== status) return false;
      if (slot === "Available today" && !(doctor.status === "Active" && doctor.next.date === TODAY)) return false;
      return true;
    });
  }, [team, specialty, query, status, slot]);

  const { page, setPage, reset, totalPages, firstIndex, visible, total } = usePagination(filtered, PAGE_SIZE);

  const clearFilters = () => {
    setSpecialty("All Doctors");
    setQuery("");
    setStatus("All Statuses");
    setSlot("Any time");
    reset();
  };

  const addDoctor = (doctor: Doctor) => {
    setTeam((current) => [...current, doctor]);
    setNotice(`${doctor.name} was added to your team.`);
    // Show the new doctor: clear filters and jump to the last page, where it was added.
    setSpecialty("All Doctors");
    setQuery("");
    setStatus("All Statuses");
    setSlot("Any time");
    setPage(Math.ceil((team.length + 1) / PAGE_SIZE));
  };

  return (
    <>
      <PageHeader
        title="Doctors"
        description="Meet your medical team and manage their information, availability, and schedules."
        actions={
          <Button iconLeft={<LuPlus />} onClick={() => setAddOpen(true)}>
            Add Doctor
          </Button>
        }
      />

      <PageBanner
        title="Exceptional care starts with great people."
        description="Manage your doctors, view their specialties and schedules, and keep the whole team in one place."
        visual={<ArchLineup photos={lineup} />}
      />

      <SplitLayout
        sideLabel="Team summary"
        aside={
          <>
            <TeamOverview doctors={team} />
            <DoctorSchedule />
            <SpecialtyDistribution doctors={team} />
          </>
        }
      >
        <Notice message={notice} onDismiss={() => setNotice(null)} />

        <FilterBar
          chips={
            <FilterChips aria-label="Filter by specialty" variant="solid" value={specialty} options={chipOptions} onChange={filter(setSpecialty)} />
          }
        >
          <SearchInput
            label="Search doctors"
            tone="white"
            value={query}
            onChange={(event) => filter(setQuery)(event.target.value)}
            placeholder="Search doctors..."
          />
          <Button
            variant="secondary"
            iconLeft={<LuSlidersHorizontal />}
            pressed={moreOpen}
            aria-expanded={moreOpen}
            aria-controls="more-doctor-filters"
            onClick={() => setMoreOpen((open) => !open)}
          >
            Filters
            {extraFilters > 0 && <Counter>{extraFilters}</Counter>}
          </Button>
        </FilterBar>

        {moreOpen && (
          <FilterPanel id="more-doctor-filters" onReset={clearFilters} canReset={hasFilters}>
            <FilterField label="Status">
              <Select size="md" aria-label="Filter by status" value={status} options={statusOptions} onChange={filter(setStatus)} />
            </FilterField>
            <FilterField label="Next availability">
              <Select size="md" aria-label="Filter by next availability" value={slot} options={slotOptions} onChange={filter(setSlot)} />
            </FilterField>
          </FilterPanel>
        )}

        {visible.length > 0 ? (
          <ul className={styles.grid} aria-label="Doctors">
            {visible.map((doctor) => (
              <li key={doctor.id}>
                <DoctorCard doctor={doctor} />
              </li>
            ))}
          </ul>
        ) : (
          <NoResults framed title="No doctors found" onClear={clearFilters} />
        )}

        <ResultsFooter
          firstIndex={firstIndex}
          shown={visible.length}
          total={total}
          noun={["doctor", "doctors"]}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </SplitLayout>

      <AddDoctorModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={addDoctor} />
    </>
  );
}
