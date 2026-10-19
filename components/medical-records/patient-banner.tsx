import { formatDate } from "@/components/appointments/dates";
import { healthFacts, patient, patientAge } from "@/components/patient-record/data";
import styles from "./medical-records.module.css";

const fact = (id: string) => healthFacts.find((item) => item.id === id)?.value ?? "";

/** Shared clinical banner: patient identity and two clearly separated health facts. */
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
          <img src={patient.photo} alt={patient.name} width={80} height={80} referrerPolicy="no-referrer" />
        </div>
        <div className={styles.pcIdentity}>
          <h2 className={styles.pcName}>
            {patient.name}
            <span className={styles.pcStatus}>{patient.status.replace(" Patient", "")}</span>
          </h2>
          <p className={styles.pcMeta}>
            {patient.id} · {patientAge} years · {patient.gender}
          </p>
          <p className={styles.pcBirth}>Born {formatDate(patient.dob, { month: "short", day: "numeric", year: "numeric" })}</p>
          <p className={styles.pcLocation}><LuMapPin aria-hidden />{patient.location}</p>
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
import { LuDroplet, LuMapPin, LuShieldAlert } from "react-icons/lu";
