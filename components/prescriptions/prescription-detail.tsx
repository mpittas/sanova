import { LuCircleCheck, LuFileText, LuPrinter, LuRefreshCw, LuSend } from "react-icons/lu";
import { formatDate } from "@/components/appointments/dates";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { MedicationVisual } from "./medication-visual";
import { prescriberPhotos, refillsLabel, type Prescription } from "./data";
import styles from "./prescriptions.module.css";

type Props = { prescription: Prescription; onRenew: () => void; onSend: () => void };

export function PrescriptionDetail({ prescription, onRenew, onSend }: Props) {
  const { medication, description, dosage, instructions, prescriber, date, status, quantity, refills, notes, sentTo } = prescription;
  return (
    <Card rounded padding="none" className={styles.detail}>
      <header className={styles.detailHeader}><span>Prescription details</span><Button variant="ghost" size="sm" iconLeft={<LuPrinter />} onClick={() => window.print()}>Print</Button></header>
      <div className={styles.detailBody}>
        <div className={styles.drugShowcase} data-tone={prescription.tone}>
          <div className={styles.drugHeading}>
            <Chip tone={status === "Active" ? "success" : "neutral"} variant="tag" size="sm">{status}</Chip>
            <h2>{medication}</h2>
            <span className={styles.strength}>{dosage}</span>
          </div>
          <MedicationVisual prescription={prescription} large />
          <p className={styles.description}>{description}</p>
        </div>
        <section className={styles.directions} aria-label="Directions for use"><span>Directions for use</span><p>{instructions}</p><span>{dosage}</span></section>
        <dl className={styles.facts}>
          <div><dt>Quantity</dt><dd>{quantity}</dd></div>
          <div><dt>Refills</dt><dd>{refillsLabel(refills)}</dd></div>
          <div><dt>Prescribed on</dt><dd>{formatDate(date, { month: "short", day: "numeric", year: "numeric" })}</dd></div>
          <div><dt>Prescription ID</dt><dd>{prescription.id.toUpperCase()}</dd></div>
        </dl>
        <div className={styles.prescriber}><Avatar name={prescriber} src={prescriberPhotos[prescriber]} size={32} /><div><span>Prescribed by</span><strong>{prescriber}</strong></div></div>
        <section className={styles.notes}><LuFileText aria-hidden /><div><h3>Care notes</h3><p>{notes}</p></div></section>
        {sentTo && <p className={styles.sent} role="status"><LuCircleCheck aria-hidden />Sent to {sentTo.split(" · ")[0]}</p>}
        <div className={styles.actions}><Button iconLeft={<LuSend />} onClick={onSend}>Send to pharmacy</Button><Button variant="secondary" iconLeft={<LuRefreshCw />} onClick={onRenew}>Renew</Button></div>
      </div>
    </Card>
  );
}
