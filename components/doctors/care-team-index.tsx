import type { CSSProperties } from "react";
import { specialties, specialtyTone, type Doctor } from "./data";
import styles from "./care-team-index.module.css";

const surname = (doctor: Doctor) => doctor.name.replace(/^Dr\.?\s+/, "").split(" ").slice(-1)[0];

type Props = { title: string; summary: string; doctors: readonly Doctor[] };

/**
 * "Your care team" banner on the Doctors page, set like the index of a book: each specialty, a dotted leader, the
 * surnames of its doctors, and how many there are. Specialties with the most doctors come first; empty ones are left out.
 */
export function CareTeamIndex({ title, summary, doctors }: Props) {
  const entries = specialties
    .map((specialty) => ({ specialty, people: doctors.filter((doctor) => doctor.specialty === specialty) }))
    .filter(({ people }) => people.length > 0)
    .sort((a, b) => b.people.length - a.people.length);

  return (
    <section className={styles.index} aria-label="Care team overview">
      <div>
        <h2>{title}</h2>
        <p>{summary}</p>
      </div>
      <ul className={styles.entries} style={{ "--rows": Math.ceil(entries.length / 2) } as CSSProperties}>
        {entries.map(({ specialty, people }) => (
          <li key={specialty} data-tone={specialtyTone[specialty]}>
            <i aria-hidden />
            <span className={styles.entry}>{specialty}</span>
            <span className={styles.leader} aria-hidden />
            <span className={styles.names}>{people.map(surname).join(", ")}</span>
            <span className={styles.count}>{people.length}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
