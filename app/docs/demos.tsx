"use client";

import { useState } from "react";
import { LuStar } from "react-icons/lu";
import { LuBuilding2, LuMail, LuUser } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Chip, type ChipTone } from "@/components/ui/chip";
import { Field } from "@/components/ui/field";
import { ChoiceChips, FilterChips } from "@/components/ui/filter-chips";
import { ImageUpload, type UploadedImage } from "@/components/ui/image-upload";
import { FilterBar, FilterField, FilterPanel } from "@/components/ui/filter-bar";
import { Modal, ModalFooter, ModalHeader, ModalPanel } from "@/components/ui/modal";
import { NoResults } from "@/components/ui/no-results";
import { Notice } from "@/components/ui/notice";
import { ResultsFooter } from "@/components/ui/results-footer";
import { SearchInput } from "@/components/ui/search-input";
import { Pagination } from "@/components/ui/pagination";
import { Segmented } from "@/components/ui/segmented";
import { Select } from "@/components/ui/select";
import { Stepper } from "@/components/ui/stepper";
import { TextArea, TextInput } from "@/components/ui/text-input";
import { Table, Th } from "@/components/ui/table";
import { Tabs } from "@/components/ui/tabs";
import styles from "./docs.module.css";

/** Live, interactive demos for the /docs page (components that hold state). */

export function ToggleButtonDemo() {
  const [on, setOn] = useState(false);
  return (
    <>
      <Button variant="secondary" pressed={on} iconLeft={<LuStar />} onClick={() => setOn((value) => !value)}>
        {on ? "Starred" : "Star"}
      </Button>
      <Button variant="secondary" iconOnly pressed={on} aria-label="Toggle star" onClick={() => setOn((value) => !value)}>
        <LuStar />
      </Button>
    </>
  );
}

const periods = ["This Year", "Last Year", "All Time"] as const;

export function SelectDemo() {
  const [small, setSmall] = useState<(typeof periods)[number]>("This Year");
  const [medium, setMedium] = useState<(typeof periods)[number]>("Last Year");
  return (
    <>
      <Select aria-label="Period (small)" value={small} options={periods} onChange={setSmall} />
      <Select size="md" aria-label="Period (medium)" value={medium} options={periods} onChange={setMedium} />
    </>
  );
}

const views = ["Day", "Week", "Month"] as const;

export function SegmentedDemo() {
  const [view, setView] = useState<(typeof views)[number]>("Week");
  return <Segmented aria-label="Calendar view" value={view} options={views} onChange={setView} />;
}

const specialtyFilters = ["All Doctors", "Cardiology", "Dermatology", "Pediatrics"] as const;
const specialtyCounts = [14, 2, 2, 2];

export function FilterChipsDemo({ variant }: { variant?: "soft" | "solid" }) {
  const [value, setValue] = useState<(typeof specialtyFilters)[number]>("All Doctors");
  return (
    <FilterChips
      aria-label="Specialty"
      variant={variant}
      value={value}
      options={specialtyFilters.map((option, index) => ({ value: option, count: specialtyCounts[index] }))}
      onChange={setValue}
    />
  );
}

const tabNames = ["All Messages", "Patients", "Care Team"] as const;

export function TabsDemo() {
  const [tab, setTab] = useState<(typeof tabNames)[number]>("All Messages");
  return (
    <div className={styles.tabsDemo}>
      <Tabs aria-label="Message type" panelId="demo-tabs" value={tab} options={tabNames} onChange={setTab} />
      <div id="demo-tabs" role="tabpanel" className={styles.tabsPanel}>
        <p className="text-small text-muted">Showing: {tab}</p>
      </div>
    </div>
  );
}

export function PaginationDemo({ totalPages = 12 }: { totalPages?: number }) {
  const [page, setPage] = useState(6);
  return <Pagination page={page} totalPages={totalPages} onChange={setPage} />;
}

export function CheckboxDemo() {
  const options = ["Email", "SMS", "Push"];
  const [checked, setChecked] = useState<string[]>(["Email"]);
  const all = checked.length === options.length;

  return (
    <div className={styles.checkboxDemo}>
      <label>
        <Checkbox
          checked={all}
          indeterminate={checked.length > 0 && !all}
          onChange={() => setChecked(all ? [] : options)}
        />
        <span className="text-label">All notifications</span>
      </label>
      {options.map((option) => (
        <label key={option} className={styles.checkboxChild}>
          <Checkbox
            checked={checked.includes(option)}
            onChange={() => setChecked((current) => (current.includes(option) ? current.filter((item) => item !== option) : [...current, option]))}
          />
          <span className="text-small">{option}</span>
        </label>
      ))}
    </div>
  );
}

type Row = { name: string; lastVisit: string; status: string; tone: ChipTone };
const rows: Row[] = [
  { name: "Emily Carter", lastVisit: "2024-04-12", status: "Active", tone: "success" },
  { name: "Robert Kim", lastVisit: "2024-03-12", status: "At Risk", tone: "danger" },
  { name: "Sophia Nguyen", lastVisit: "2024-04-03", status: "Inactive", tone: "neutral" },
  { name: "Daniel Lee", lastVisit: "2024-04-20", status: "Active", tone: "success" },
];

export function SortableTableDemo() {
  const [sort, setSort] = useState<{ key: "name" | "lastVisit"; direction: "asc" | "desc" } | null>(null);

  const sorted = sort
    ? [...rows].sort((a, b) => a[sort.key].localeCompare(b[sort.key]) * (sort.direction === "asc" ? 1 : -1))
    : rows;

  const cycle = (key: "name" | "lastVisit") =>
    setSort((current) => {
      if (current?.key !== key) return { key, direction: "asc" };
      return current.direction === "asc" ? { key, direction: "desc" } : null;
    });

  return (
    <Card padding="none">
      <Table variant="banded" minWidth={420}>
        <thead>
          <tr>
            <Th sort={{ direction: sort?.key === "name" ? sort.direction : null, onSort: () => cycle("name") }}>Patient</Th>
            <Th sort={{ direction: sort?.key === "lastVisit" ? sort.direction : null, onSort: () => cycle("lastVisit") }}>
              Last visit
            </Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.name}>
              <td className="text-label">{row.name}</td>
              <td className="num">{row.lastVisit}</td>
              <td>
                <Chip tone={row.tone}>{row.status}</Chip>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}

export function FormDemo() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState<"Cardiology" | "Pediatrics" | "">("");
  const [email, setEmail] = useState("not-an-email");
  const [bio, setBio] = useState("");
  return (
    <div className={styles.formDemo}>
      <Field label="Full name" required hint="As it should appear on the doctor's profile.">
        {(control) => (
          <TextInput {...control} size="lg" icon={<LuUser />} placeholder="Enter full name" value={name} onChange={(event) => setName(event.target.value)} />
        )}
      </Field>
      <Field label="Department">
        {(control) => (
          <Select {...control} size="lg" icon={<LuBuilding2 />} placeholder="Select department" value={department} options={["Cardiology", "Pediatrics"] as const} onChange={setDepartment} />
        )}
      </Field>
      <Field label="Email address" required error="Enter an email address like name@clinic.com.">
        {(control) => <TextInput {...control} size="lg" icon={<LuMail />} invalid value={email} onChange={(event) => setEmail(event.target.value)} />}
      </Field>
      <Field label="Short bio">
        {(control) => <TextArea {...control} rows={3} placeholder="A few sentences patients will see." value={bio} onChange={(event) => setBio(event.target.value)} />}
      </Field>
    </div>
  );
}

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export function ChoiceChipsDemo() {
  const [days, setDays] = useState<string[]>(["Mon", "Tue", "Wed"]);
  return (
    <ChoiceChips
      aria-label="Working days"
      value={days}
      options={dayNames}
      onToggle={(day) => setDays((current) => (current.includes(day) ? current.filter((item) => item !== day) : [...current, day]))}
    />
  );
}

export function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} labelledBy="demo-modal-title" width={480}>
        <ModalPanel>
          <ModalHeader
            title="Remove this doctor?"
            titleId="demo-modal-title"
            description="They will no longer appear in schedules. Booked appointments stay on the calendar."
            onClose={() => setOpen(false)}
          />
          <ModalFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              Remove doctor
            </Button>
          </ModalFooter>
        </ModalPanel>
      </Modal>
    </>
  );
}

const demoSteps = [
  { label: "Basic Information", description: "Personal and professional details" },
  { label: "Schedule", description: "Set working hours and location" },
  { label: "Review", description: "Check details before adding" },
];

export function StepperDemo() {
  const [current, setCurrent] = useState(1);
  return (
    <div className={styles.stepperDemo}>
      <Stepper aria-label="Example steps" steps={demoSteps} current={current} onSelect={setCurrent} />
      <div className={styles.stepperDemoActions}>
        <Button variant="secondary" size="sm" disabled={current === 0} onClick={() => setCurrent(current - 1)}>
          Back
        </Button>
        <Button size="sm" disabled={current === demoSteps.length - 1} onClick={() => setCurrent(current + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}

export function ImageUploadDemo() {
  const [image, setImage] = useState<UploadedImage | null>(null);
  return (
    <div className={styles.uploadDemo}>
      <ImageUpload label="Profile photo" previewName="Amara Nwosu" value={image} onChange={setImage} />
    </div>
  );
}

export function NoticeDemo() {
  const [message, setMessage] = useState<string | null>("Dr. Mia Chen was added to your team.");
  return (
    <div className={styles.noticeDemo}>
      <Notice message={message} onDismiss={() => setMessage(null)} autoDismiss={0} />
      {!message && (
        <Button variant="secondary" size="sm" onClick={() => setMessage("Dr. Mia Chen was added to your team.")}>
          Show it again
        </Button>
      )}
    </div>
  );
}

const demoSpecialties = ["All Doctors", "Cardiology", "Pediatrics"] as const;

export function ListToolbarDemo() {
  const [specialty, setSpecialty] = useState<(typeof demoSpecialties)[number]>("All Doctors");
  const [open, setOpen] = useState(true);
  const [status, setStatus] = useState("All Statuses");
  const [page, setPage] = useState(1);

  return (
    <div className={styles.toolbarDemo}>
      <FilterBar
        chips={
          <FilterChips
            aria-label="Filter by specialty"
            variant="solid"
            value={specialty}
            options={demoSpecialties.map((value, index) => ({ value, count: [14, 4, 2][index] }))}
            onChange={setSpecialty}
          />
        }
      >
        <SearchInput label="Search doctors" tone="white" placeholder="Search doctors..." />
        <Button variant="secondary" pressed={open} aria-expanded={open} aria-controls="demo-filter-panel" onClick={() => setOpen((value) => !value)}>
          Filters
        </Button>
      </FilterBar>
      {open && (
        <FilterPanel id="demo-filter-panel" canReset={status !== "All Statuses"} onReset={() => setStatus("All Statuses")}>
          <FilterField label="Status">
            <Select size="md" aria-label="Filter by status" value={status} options={["All Statuses", "Active", "On Leave"]} onChange={setStatus} />
          </FilterField>
        </FilterPanel>
      )}
      <ResultsFooter firstIndex={(page - 1) * 6} shown={6} total={24} noun={["doctor", "doctors"]} page={page} totalPages={4} onPageChange={setPage} />
      <Card rounded>
        <NoResults title="No doctors found" onClear={() => setSpecialty("All Doctors")} />
      </Card>
    </div>
  );
}
