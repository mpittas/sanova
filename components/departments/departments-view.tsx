"use client";

import { useMemo, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/ui/filter-bar";
import { FilterChips } from "@/components/ui/filter-chips";
import { NoResults } from "@/components/ui/no-results";
import { ArchLineup, PageBanner } from "@/components/ui/page-banner";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { doctorByName } from "@/components/doctors/data";
import { departments, type DepartmentName } from "./data";
import { DepartmentActivity } from "./department-activity";
import { DepartmentCard } from "./department-card";
import { DepartmentStats } from "./department-stats";
import { RecentUpdates } from "./recent-updates";
import styles from "./departments.module.css";

const lineup = ["Dr. Ava Martinez", "Dr. Noah Wilson", "Dr. Liam Carter"].map((name) => doctorByName(name)!.photo);

type DepartmentFilter = "All Departments" | DepartmentName;

const sortOptions = ["Sort by: Default", "Sort by: Name", "Sort by: Doctors", "Sort by: Patients", "Sort by: Satisfaction"] as const;
type SortOption = (typeof sortOptions)[number];

const chipOptions = (["All Departments", ...departments.map(({ name }) => name)] as DepartmentFilter[]).map((value) => ({ value }));

const sorters: Record<SortOption, (a: (typeof departments)[number], b: (typeof departments)[number]) => number> = {
  "Sort by: Default": () => 0,
  "Sort by: Name": (a, b) => a.name.localeCompare(b.name),
  "Sort by: Doctors": (a, b) => b.doctors - a.doctors,
  "Sort by: Patients": (a, b) => b.patients - a.patients,
  "Sort by: Satisfaction": (a, b) => b.satisfaction - a.satisfaction,
};

export function DepartmentsView() {
  const [filter, setFilter] = useState<DepartmentFilter>("All Departments");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("Sort by: Default");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return departments
      .filter((department) => filter === "All Departments" || department.name === filter)
      .filter((department) => !needle || [department.name, department.description].some((field) => field.toLowerCase().includes(needle)))
      .toSorted(sorters[sort]);
  }, [filter, query, sort]);

  const clear = () => {
    setFilter("All Departments");
    setQuery("");
  };

  return (
    <>
      <PageHeader
        title="Departments"
        description="Organize and manage your clinic's departments, services, and care teams all in one place."
        actions={<Button iconLeft={<LuPlus />}>Add Department</Button>}
      />

      <PageBanner
        title="Better care through collaboration"
        description="Streamline your departments and empower every specialist."
        visual={<ArchLineup photos={lineup} />}
      />

      <DepartmentStats departments={departments} />

      <FilterBar
        chips={<FilterChips aria-label="Filter by department" value={filter} options={chipOptions} onChange={setFilter} />}
      >
        <SearchInput label="Search departments" tone="white" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search..." />
        <Select size="md" aria-label="Sort departments" value={sort} options={sortOptions} onChange={setSort} />
      </FilterBar>

      {visible.length > 0 ? (
        <ul className={styles.grid} aria-label="Departments">
          {visible.map((department) => (
            <li key={department.name}>
              <DepartmentCard department={department} />
            </li>
          ))}
        </ul>
      ) : (
        <NoResults framed title="No departments found" description="Try a different search or pick another department." onClear={clear} />
      )}

      <div className={styles.bottom}>
        <DepartmentActivity />
        <RecentUpdates />
      </div>
    </>
  );
}
