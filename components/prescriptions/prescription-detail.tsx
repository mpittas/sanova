import { LuCalendarDays, LuCircleCheck, LuClipboardList, LuFileText, LuPackage, LuPill, LuPrinter, LuRefreshCw, LuSend } from "react-icons/lu";
import { formatDate } from "@/components/appointments/dates";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { InfoGrid, InfoTile } from "@/components/ui/info-tile";
import { prescriberPhotos, refillsLabel, type Prescription } from "./data";
import styles from "./prescriptions.module.css";

type PrescriptionDetailProps = {
  prescription: Prescription;
  onRenew: () => void;
  onSend: () => void;
};

export function PrescriptionDetail({ prescription, onRenew, onSend }: PrescriptionDetailProps) {
  const { medication, description, dosage, instructions, prescriber, date, status, quantity, refills, notes, icon: Icon, tone, sentTo } = prescription;
  const active = status === "Active";

  const details = [
    { label: "Dosage", value: dosage, icon: LuPill },
    { label: "Instructions", value: instructions, icon: LuClipboardList },
    { label: "Quantity", value: quantity, icon: LuPackage },
    { label: "Refills", value: refillsLabel(refills), icon: LuRefreshCw },
  ];

  return (
    <Card rounded padding="none" className={styles.detail}>
      <section className={`banner-surface banner-surface-flush grain ${styles.hero}`} data-tone={tone} aria-label={medication}>
        <div className={styles.heroText}>
          <Chip tone={active ? "success" : "neutral"}>{active ? "Active Prescription" : "Completed Prescription"}</Chip>
          <div>
            <h2 className="text-h2 banner-title">{medication}</h2>
            <p className="text-body banner-text">{description}</p>
          </div>
        </div>
        {/* Decorative: soft rings with the medication's icon, in its colour. */}
        <span className={styles.ring} aria-hidden>
          <Icon />
        </span>
      </section>

      <div className={styles.detailBody}>
        <InfoGrid columns={3}>
          <InfoTile variant="fact" label="Prescribed By" value={prescriber} leading={<Avatar name={prescriber} src={prescriberPhotos[prescriber]} size={40} />} />
          <InfoTile variant="fact" label="Date Prescribed" value={formatDate(date, { month: "short", day: "numeric", year: "numeric" })} icon={LuCalendarDays} tone="blue" />
          <InfoTile variant="fact" label="Status" value={status} icon={LuCircleCheck} tone={active ? "success" : "primary"} />
        </InfoGrid>

        <section aria-labelledby="rx-details-title">
          <h3 id="rx-details-title" className="text-h4">
            Prescription Details
          </h3>
          <div className={styles.details}>
            <InfoGrid columns={2}>
              {details.map(({ label, value, icon }) => (
                <InfoTile key={label} variant="fact" label={label} value={value} icon={icon} tone="primary" />
              ))}
            </InfoGrid>
          </div>

          <div className={styles.notes}>
            <LuFileText className={styles.notesIcon} aria-hidden />
            <div className="text-stack">
              <p className="text-caption text-muted">Notes</p>
              <p className="text-small">{notes}</p>
            </div>
          </div>
        </section>

        {sentTo && (
          <p className={`text-small ${styles.sent}`} role="status">
            <LuCircleCheck aria-hidden />
            Sent to {sentTo.split(" · ")[0]}
          </p>
        )}

        <div className={styles.actions}>
          <Button iconLeft={<LuRefreshCw />} onClick={onRenew}>
            Renew Prescription
          </Button>
          <Button variant="secondary" iconLeft={<LuPrinter />} onClick={() => window.print()}>
            Print
          </Button>
          <Button variant="secondary" iconLeft={<LuSend />} onClick={onSend}>
            Send to Pharmacy
          </Button>
        </div>
      </div>
    </Card>
  );
}
