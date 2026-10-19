import { LuChevronDown } from "react-icons/lu";
import { formatDate } from "@/components/appointments/dates";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ToneTile } from "@/components/ui/tone-tile";
import type { PatientDocument } from "./data";
import styles from "./medical-records.module.css";

type DocumentsCardProps = {
  title: string;
  description?: string;
  documents: readonly PatientDocument[];
  /** Shows a "View All" link in the header. */
  onViewAll?: () => void;
  /** Set when the card is the panel of the Documents tab. */
  panel?: { id: string; labelledBy: string };
};

export function DocumentsCard({ title, description, documents, onViewAll, panel }: DocumentsCardProps) {
  return (
    <Card
      rounded
      id={panel?.id}
      role={panel ? "tabpanel" : undefined}
      aria-labelledby={panel?.labelledBy}
      title={title}
      description={description}
      action={
        onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All
          </Button>
        )
      }
    >
      {documents.length === 0 && <p className="text-small text-muted">No documents match your filters. Try a different search or time range.</p>}
      <ul className={styles.documents}>
        {documents.map(({ id, name, date, type, size, icon: Icon, tone }) => (
          <li key={id}><details><summary className={styles.documentSummary}>
            <ToneTile tone={tone} size={48}>
              <Icon />
            </ToneTile>
            <span className="text-stack">
              <span className="text-label">{name}</span>
              <span className="text-small text-muted">
                <span className="num">{formatDate(date, { month: "short", day: "numeric", year: "numeric" })}</span> • {type} •{" "}
                <span className="num">{size}</span>
              </span>
            </span>
            <LuChevronDown aria-hidden />
            </summary><div className={styles.documentInfo}>File type: {type}<br />File size: {size}<br />Original file is not attached to this demo record.</div></details>          </li>
        ))}
      </ul>
    </Card>
  );
}

