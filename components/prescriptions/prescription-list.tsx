import { LuChevronRight, LuFilePlus } from "react-icons/lu";
import { formatDate } from "@/components/appointments/dates";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { ToneTile } from "@/components/ui/tone-tile";
import { ranges, type Prescription, type Range } from "./data";
import styles from "./prescriptions.module.css";

type PrescriptionListProps = {
  prescriptions: readonly Prescription[];
  selectedId: string | undefined;
  onSelect: (id: string) => void;
  range: Range;
  onRangeChange: (range: Range) => void;
};

/** Timeline of every prescription, newest first. One is selected at a time. */
export function PrescriptionList({ prescriptions, selectedId, onSelect, range, onRangeChange }: PrescriptionListProps) {
  return (
    <Card
      rounded
      title="Prescription History"
      description="View and manage all prescriptions for this patient."
      action={<Select size="md" aria-label="Time range" value={range} options={ranges} onChange={onRangeChange} />}
    >
      {prescriptions.length > 0 ? (
        <ol className={styles.timeline} aria-label="Prescriptions">
          {prescriptions.map((prescription) => {
            const { id, medication, dosage, instructions, prescriber, indication, date, status, icon: Icon, tone } = prescription;
            const selected = id === selectedId;
            return (
              <li key={id} className={styles.item} data-status={status}>
                <span className={styles.dot} aria-hidden />
                <div className={styles.when}>
                  <time className="text-small text-muted num" dateTime={date}>
                    {formatDate(date, { month: "short", day: "numeric", year: "numeric" })}
                  </time>
                  <Chip tone={status === "Active" ? "success" : "neutral"} variant="tag" size="sm">
                    {status}
                  </Chip>
                </div>
                <button type="button" className={styles.rx} aria-pressed={selected} data-tone={tone} onClick={() => onSelect(id)}>
                  <ToneTile tone={tone} size={56}>
                    <Icon />
                  </ToneTile>
                  <span className={styles.rxText}>
                    <span className="text-label">{medication}</span>
                    <span className="text-small text-muted">
                      {dosage} • {instructions}
                    </span>
                    <span className="text-small text-muted">
                      {prescriber} • {indication}
                    </span>
                  </span>
                  <LuChevronRight className={styles.chevron} aria-hidden />
                </button>
              </li>
            );
          })}
        </ol>
      ) : (
        <EmptyState
          icon={LuFilePlus}
          size="compact"
          title="No prescriptions in this period"
          description="Try a longer time range."
          action={
            <Button variant="secondary" size="sm" onClick={() => onRangeChange("All Time")}>
              Show all time
            </Button>
          }
        />
      )}
    </Card>
  );
}
