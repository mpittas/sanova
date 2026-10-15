import type { ReactNode } from "react";
import { LuBadgeCheck, LuCornerRightUp, LuMail, LuMapPin, LuPhone } from "react-icons/lu";
import { formatDate } from "@/components/appointments/dates";
import { Chip } from "@/components/ui/chip";
import { patient, patientAge } from "./data";
import styles from "./patient-record.module.css";

type PatientBannerProps = {
  /** `cover` (default): the portrait bleeds off the left edge, with the status chip. `card`: a rounded portrait tile and a short tagline. */
  variant?: "cover" | "card";
  /** Tagline shown on the right of the `card` variant. */
  tagline?: string;
  /** Replaces the tagline with any element, e.g. a link card. */
  aside?: ReactNode;
};

/** Who this record belongs to: portrait, basics and contact details on a soft green banner. */
export function PatientBanner({ variant = "cover", tagline, aside }: PatientBannerProps) {
  const meta = [
    `${patientAge} years old`,
    patient.gender,
    formatDate(patient.dob, { month: "short", day: "numeric", year: "numeric" }),
    `Patient ID ${patient.id}`,
  ];
  const contacts = [
    { icon: LuPhone, label: "Phone", value: patient.phone },
    { icon: LuMail, label: "Email", value: patient.email },
    { icon: LuMapPin, label: "Clinic", value: patient.location },
  ];
  const card = variant === "card";

  return (
    <section className={`banner-surface grain ${styles.banner}`} data-variant={variant} aria-label="Patient">
      <div className={styles.portrait}>
        {/* Small remote portrait: a plain <img> avoids image-optimizer setup for placeholder photos. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={patient.photo} alt={patient.name} width={240} height={240} referrerPolicy="no-referrer" />
      </div>

      <div className={styles.identity}>
        <h2 className="text-h1 banner-title">
          {patient.name}
          <LuBadgeCheck className={styles.verified} aria-label="Verified patient" />
        </h2>

        <ul className={`text-body-lg banner-text ${styles.meta}`}>
          {meta.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <ul className={styles.contacts}>
          {contacts.map(({ icon: Icon, label, value }) => (
            <li key={label} className={`text-small ${styles.contact}`}>
              <Icon aria-hidden />
              <span className="sr-only">{label}: </span>
              {value}
            </li>
          ))}
        </ul>
      </div>

      {!card && (
        <Chip tone="success" className={styles.status}>
          {patient.status}
        </Chip>
      )}

      {card && aside && <div className={styles.aside}>{aside}</div>}

      {card && !aside && tagline && (
        <div className={styles.tagline}>
          <p className="text-h3">{tagline}</p>
          <LuCornerRightUp aria-hidden />
        </div>
      )}

      {/* Decorative shapes on the right edge. */}
      {card ? (
        <svg className={styles.swoosh} viewBox="0 0 360 200" preserveAspectRatio="xMaxYMid slice" aria-hidden>
          <path d="M360 0H150C190 50 200 120 140 200H360Z" fill="var(--color-primary-200)" opacity=".5" />
          <path d="M360 0H215C250 60 250 130 200 200H360Z" fill="var(--color-primary-300)" opacity=".35" />
        </svg>
      ) : (
        <svg className={styles.leaves} viewBox="0 0 240 200" aria-hidden>
          <path d="M118 200C98 150 104 96 150 62 162 112 156 160 118 200Z" fill="var(--color-primary-300)" opacity=".6" />
          <path d="M150 200C128 130 140 56 214 0 230 78 206 156 150 200Z" fill="var(--color-primary-500)" opacity=".55" />
          <path d="M196 200C190 130 214 76 250 40 252 116 236 170 196 200Z" fill="var(--color-primary-600)" opacity=".7" />
        </svg>
      )}
    </section>
  );
}
