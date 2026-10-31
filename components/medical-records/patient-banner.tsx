import { LuDroplet, LuMapPin, LuShieldAlert } from "react-icons/lu";
import { formatDate } from "@/components/appointments/dates";
import { healthFacts, patient, patientAge } from "@/components/patient-record/data";
import styles from "./medical-records.module.css";

const fact = (id: string) => healthFacts.find((item) => item.id === id)?.value ?? "";

/** Shared clinical banner: who the patient is, and the two health facts a clinician needs at a glance. */
export function PatientBanner() {
  const facts = [
    { label: "Blood type", value: fact("blood"), icon: LuDroplet },
    { label: "Allergies", value: fact("allergies"), icon: LuShieldAlert, alert: true },
  ];

  return (
    <section className={styles.patientCard} aria-label="Patient">
      <div className={styles.pcMain}>
        <div className={styles.pcPortrait}>
          {/* Small remote portrait: a plain <img> avoids image-optimizer setup for placeholder photos. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={patient.photo} alt={patient.name} width={96} height={96} referrerPolicy="no-referrer" />
        </div>
        <div className={styles.pcIdentity}>
          <h2 className={styles.pcName}>
            {patient.name}
            <span className={styles.pcStatus}>{patient.status.replace(" Patient", "")}</span>
          </h2>
          <p className={styles.pcMeta}>
            {patient.id} · {patientAge} years · {patient.gender}
          </p>
          <p className={styles.pcBirth}>
            <span>Born {formatDate(patient.dob, { month: "short", day: "numeric", year: "numeric" })}</span>
            <span><LuMapPin aria-hidden />{patient.location}</span>
          </p>
        </div>
      </div>

      <dl className={styles.pcFacts}>
        {facts.map(({ label, value, icon: Icon, alert }) => (
          <div key={label} data-alert={alert || undefined}>
            <dt><Icon aria-hidden />{label}</dt>
            <dd data-alert={alert || undefined}>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
