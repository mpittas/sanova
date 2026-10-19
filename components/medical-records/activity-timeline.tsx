"use client";

import { useId, useState } from "react";
import { LuChevronRight, LuFileSearch } from "react-icons/lu";
import { formatDate } from "@/components/appointments/dates";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { ToneTile } from "@/components/ui/tone-tile";
import { recordMeta, type MedicalRecord, type Range } from "./data";
import styles from "./medical-records.module.css";

function RecordItem({ record }: { record: MedicalRecord }) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const { icon: Icon, tone, chip } = recordMeta[record.type];

  return (
    <li className={styles.item} data-tone={tone}>
      <ToneTile tone={tone} size={40}>
        <Icon />
      </ToneTile>
      <div className={styles.entry}>
        <div className={styles.entryHead}>
          <h4 className="text-label">{record.title}</h4>
          <Chip tone={chip} variant="tag" size="sm">
            {record.type}
          </Chip>
        </div>
        <p className={`text-small text-muted ${styles.entryMeta}`}>
          <time dateTime={record.date}>{formatDate(record.date, { month: "short", day: "numeric", year: "numeric" })}</time>
          <span aria-hidden>·</span>
          <span>{[record.source, record.subtitle].filter(Boolean).join(" • ")}</span>
        </p>
        <p className={styles.summary}>{record.summary}</p>
        <Button
          variant="ghost"
          size="sm"
          className={styles.expand}
          aria-expanded={open}
          aria-controls={detailsId}
          aria-label={`${open ? "Hide" : "Show"} details for ${record.title}`}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Less" : "Details"}
          <LuChevronRight />
        </Button>

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

/** Records are already newest first, so a month heading starts whenever the month changes. */
function groupByMonth(records: readonly MedicalRecord[]) {
  const groups: { key: string; label: string; items: MedicalRecord[] }[] = [];
  for (const record of records) {
    const key = record.date.slice(0, 7);
    let group = groups.at(-1);
    if (group?.key !== key) {
      group = { key, label: formatDate(record.date, { month: "long", year: "numeric" }), items: [] };
      groups.push(group);
    }
    group.items.push(record);
  }
  return groups;
}

type ActivityTimelineProps = {
  title: string;
  description: string;
  records: readonly MedicalRecord[];
  range: Range;
  onRangeChange: (range: Range) => void;
};

export function ActivityTimeline({ title, description, records, range, onRangeChange }: ActivityTimelineProps) {
  return (
    <Card
      rounded
      title={title}
      description={description}
      className={styles.timelineCard}
    >
      {records.length > 0 ? (
        <div className={styles.groups}>
          {groupByMonth(records).map(({ key, label, items }) => (
            <section key={key} aria-label={label}>
              <h3 className={styles.month}>
                {label}
                <span>{items.length}</span>
              </h3>
              <ol className={styles.timeline}>
                {items.map((record) => (
                  <RecordItem key={record.id} record={record} />
                ))}
              </ol>
            </section>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={LuFileSearch}
          size="compact"
          title="No matching records"
          description="Try another search or time range, or add a new record."
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
