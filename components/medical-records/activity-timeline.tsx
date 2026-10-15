"use client";

import { useId, useState } from "react";
import { LuChevronRight, LuFileSearch } from "react-icons/lu";
import { formatDate } from "@/components/appointments/dates";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { ToneTile } from "@/components/ui/tone-tile";
import { ranges, recordMeta, type MedicalRecord, type Range } from "./data";
import styles from "./medical-records.module.css";

function RecordItem({ record }: { record: MedicalRecord }) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const { icon: Icon, tone, chip } = recordMeta[record.type];

  return (
    <li className={styles.item} data-tone={tone}>
      <span className={styles.dot} aria-hidden />

      <div className={styles.row}>
        <div className={styles.entry}>
          <ToneTile tone={tone} size={48}>
            <Icon />
          </ToneTile>
          <time className={`text-small text-muted num ${styles.date}`} dateTime={record.date}>
            {formatDate(record.date, { month: "short", day: "numeric", year: "numeric" })}
          </time>
          <div className={styles.entryText}>
            <h3 className="text-label">{record.title}</h3>
            <p className="text-small text-muted">{[record.source, record.subtitle].filter(Boolean).join(" • ")}</p>
            <p className={`text-small text-muted ${styles.summary}`}>{record.summary}</p>
          </div>
          <Chip tone={chip} variant="tag" size="sm" className={styles.type}>
            {record.type}
          </Chip>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            className={styles.expand}
            aria-expanded={open}
            aria-controls={detailsId}
            aria-label={`${open ? "Hide" : "Show"} details for ${record.title}`}
            onClick={() => setOpen((value) => !value)}
          >
            <LuChevronRight />
          </Button>
        </div>

        {open && (
          <dl id={detailsId} className={styles.details}>
            {record.details.map(({ label, value }) => (
              <div key={label}>
                <dt className="text-caption text-muted">{label}</dt>
                <dd className="text-label">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </li>
  );
}

type ActivityTimelineProps = {
  title: string;
  description: string;
  records: readonly MedicalRecord[];
  range: Range;
  onRangeChange: (range: Range) => void;
  /** Id and label of the tab that controls this panel. */
  panelId: string;
  labelledBy: string;
};

export function ActivityTimeline({ title, description, records, range, onRangeChange, panelId, labelledBy }: ActivityTimelineProps) {
  return (
    <Card
      rounded
      id={panelId}
      role="tabpanel"
      aria-labelledby={labelledBy}
      title={title}
      description={description}
      action={<Select aria-label="Time range" value={range} options={ranges} onChange={onRangeChange} />}
    >
      {records.length > 0 ? (
        <ol className={styles.timeline}>
          {records.map((record) => (
            <RecordItem key={record.id} record={record} />
          ))}
        </ol>
      ) : (
        <EmptyState
          icon={LuFileSearch}
          size="compact"
          title="No records in this period"
          description="Try a longer time range, or add a new record."
          action={
            range !== "All Time" ? (
              <Button variant="secondary" size="sm" onClick={() => onRangeChange("All Time")}>
                Show all time
              </Button>
            ) : undefined
          }
        />
      )}
    </Card>
  );
}
