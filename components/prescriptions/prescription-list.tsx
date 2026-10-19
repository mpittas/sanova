import { LuArrowUpRight, LuPill } from "react-icons/lu";
import { formatDate } from "@/components/appointments/dates";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { MedicationVisual } from "./medication-visual";
import { ranges, type Prescription, type Range } from "./data";
import styles from "./prescriptions.module.css";

type Props = {
  prescriptions: readonly Prescription[];
  allPrescriptions: readonly Prescription[];
  selectedId?: string;
  onSelect: (id: string) => void;
  range: Range;
  onRangeChange: (range: Range) => void;
  query: string;
  onQueryChange: (query: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
};

export function PrescriptionList({ prescriptions, allPrescriptions, selectedId, onSelect, range, onRangeChange, query, onQueryChange, status, onStatusChange }: Props) {
  return (
    <Card rounded padding="none" className={styles.listCard}>
      <header className={styles.listHeader}>
        <div><h2>Medications <span>{allPrescriptions.length}</span></h2><p>A clear view of your patient’s treatment.</p></div>
        <Select size="md" aria-label="Time range" value={range} options={ranges} onChange={onRangeChange} />
      </header>
      <div className={styles.filters}>
        <SearchInput label="Search medications" placeholder="Search medication or prescriber…" value={query} onChange={(event) => onQueryChange(event.target.value)} />
        <Select size="md" aria-label="Prescription status" value={status} options={["All", "Active", "Completed"]} onChange={onStatusChange} />
      </div>
      {prescriptions.length ? (
        <ul className={styles.medications} aria-label="Prescriptions">
          {prescriptions.map((prescription) => {
            const { id, medication, dosage, prescriber, date, status: rxStatus, indication } = prescription;
            return (
            <li key={id}>
              <button type="button" className={styles.rx} aria-pressed={id === selectedId} onClick={() => onSelect(id)}>
                <span className={styles.rxTop}><MedicationVisual prescription={prescription} /><span className={styles.rxText}><strong>{medication}</strong><span>{dosage} · {indication}</span></span><LuArrowUpRight className={styles.chevron} aria-hidden /></span>
                <span className={styles.rxBottom}><Chip tone={rxStatus === "Active" ? "success" : "neutral"} variant="tag" size="sm">{rxStatus}</Chip><span>{prescriber}</span><time dateTime={date}>{formatDate(date, { month: "short", day: "numeric", year: "numeric" })}</time></span>
              </button>
            </li>
          ); })}
        </ul>
      ) : <div className={styles.empty}><EmptyState icon={LuPill} title="No matching medications" description="Try a different search, status, or time range." /></div>}
      <footer className={styles.listFooter}>{prescriptions.length} of {allPrescriptions.length} prescriptions</footer>
    </Card>
  );
}
