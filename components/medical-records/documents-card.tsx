import { LuDownload, LuEllipsisVertical } from "react-icons/lu";
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
      <ul className={styles.documents}>
        {documents.map(({ id, name, date, type, size, icon: Icon, tone }) => (
          <li key={id}>
            <ToneTile tone={tone} size={48}>
              <Icon />
            </ToneTile>
            <span className="text-stack">
              <span className="text-label">{name}</span>
              <span className="text-small text-muted num">
                {formatDate(date, { month: "short", day: "numeric", year: "numeric" })} • {type} • {size}
              </span>
            </span>
            <span className={styles.documentActions}>
              <Button variant="ghost" size="sm" iconOnly aria-label={`Download ${name}`}>
                <LuDownload />
              </Button>
              <Button variant="ghost" size="sm" iconOnly aria-label={`More actions for ${name}`}>
                <LuEllipsisVertical />
              </Button>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
