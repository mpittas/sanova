"use client";

import { useEffect, useMemo, useState } from "react";
import { LuCircleCheck, LuPlus, LuSearchX, LuSlidersHorizontal, LuX } from "react-icons/lu";
import { TODAY } from "@/components/appointments/data";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Counter } from "@/components/ui/counter";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterChips } from "@/components/ui/filter-chips";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { AddDoctorModal } from "./add-doctor-modal";
import { doctors as seedDoctors, specialties, type Doctor, type Specialty } from "./data";
import { DoctorCard } from "./doctor-card";
import { DoctorSchedule } from "./doctor-schedule";
import { DoctorsHero } from "./doctors-hero";
import { SpecialtyDistribution } from "./specialty-distribution";
import { TeamOverview } from "./team-overview";
import styles from "./doctors.module.css";

type SpecialtyFilter = "All Doctors" | Specialty;

const statusOptions = ["All Statuses", "Active", "On Leave"] as const;
const slotOptions = ["Any time", "Available today"] as const;
const PAGE_SIZE = 6;

export function DoctorsView() {
  const [team, setTeam] = useState<Doctor[]>(seedDoctors);
  const [addOpen, setAddOpen] = useState(false);
  const [added, setAdded] = useState<string | null>(null);

  const [specialty, setSpecialty] = useState<SpecialtyFilter>("All Doctors");
  const [query, setQuery] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("All Statuses");
  const [slot, setSlot] = useState<(typeof slotOptions)[number]>("Any time");
  const [page, setPage] = useState(1);

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
    setPage(1);
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const firstIndex = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(firstIndex, firstIndex + PAGE_SIZE);

  const clearFilters = () => {
    setSpecialty("All Doctors");
    setQuery("");
    setStatus("All Statuses");
    setSlot("Any time");
    setPage(1);
  };

  const addDoctor = (doctor: Doctor) => {
    setTeam((current) => [...current, doctor]);
    setAdded(doctor.name);
    // Show the new doctor: clear filters and jump to the last page, where it was added.
    setSpecialty("All Doctors");
    setQuery("");
    setStatus("All Statuses");
    setSlot("Any time");
    setPage(Math.ceil((team.length + 1) / PAGE_SIZE));
  };

  // The confirmation fades after a few seconds; it can also be dismissed.
  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(null), 6000);
    return () => window.clearTimeout(timer);
  }, [added]);

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

      <div className={styles.layout}>
        <div className={styles.main}>
          <DoctorsHero />

          {added && (
            <div className={styles.notice} role="status">
              <LuCircleCheck aria-hidden />
              <p className="text-label">{added} was added to your team.</p>
              <Button variant="ghost" size="sm" iconOnly aria-label="Dismiss" onClick={() => setAdded(null)}>
                <LuX />
              </Button>
            </div>
          )}

          <div className={styles.toolbar}>
            <FilterChips
              aria-label="Filter by specialty"
              variant="solid"
              className={styles.chips}
              value={specialty}
              options={chipOptions}
              onChange={filter(setSpecialty)}
            />
            <div className={styles.tools}>
              <SearchInput
                label="Search doctors"
                wrapperClassName={styles.search}
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
            </div>
          </div>

          {moreOpen && (
            <Card id="more-doctor-filters" className={styles.more}>
              <label className={styles.moreField}>
                <span className="text-small text-muted">Status</span>
                <Select size="md" aria-label="Filter by status" value={status} options={statusOptions} onChange={filter(setStatus)} />
              </label>
              <label className={styles.moreField}>
                <span className="text-small text-muted">Next availability</span>
                <Select size="md" aria-label="Filter by next availability" value={slot} options={slotOptions} onChange={filter(setSlot)} />
              </label>
              <Button variant="ghost" size="sm" disabled={!hasFilters} onClick={clearFilters}>
                Reset filters
              </Button>
            </Card>
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
            <Card rounded>
              <EmptyState
                icon={LuSearchX}
                title="No doctors found"
                description="Try a different search or adjust your filters."
                action={
                  <Button variant="secondary" size="sm" onClick={clearFilters}>
                    Clear filters
                  </Button>
                }
              />
            </Card>
          )}

          <div className={styles.footer}>
            <p className="text-small text-muted num" aria-live="polite">
              {filtered.length === 0
                ? "Showing 0 doctors"
                : `Showing ${firstIndex + 1}–${firstIndex + visible.length} of ${filtered.length} ${filtered.length === 1 ? "doctor" : "doctors"}`}
            </p>
            <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>

        <aside className={styles.side} aria-label="Team summary">
          <TeamOverview doctors={team} />
          <DoctorSchedule />
          <SpecialtyDistribution doctors={team} />
        </aside>
      </div>

      <AddDoctorModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={addDoctor} />
    </>
  );
}
