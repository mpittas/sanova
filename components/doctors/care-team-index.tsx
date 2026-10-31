import { Avatar } from "@/components/ui/avatar";
import { specialties, specialtyTone, type Doctor } from "./data";
import styles from "./care-team-index.module.css";

type Props = { title: string; summary: string; doctors: readonly Doctor[] };

/**
 * "Your care team" banner on the Doctors page, a quiet white card like the patient banner: the headcount and title on the
 * left, then the team itself, one tinted tile per specialty with its portraits, name and headcount.
 * Specialties with the most doctors come first; empty ones are left out.
 */
export function CareTeamIndex({ title, summary, doctors }: Props) {
  const groups = specialties
    .map((specialty) => ({ specialty, people: doctors.filter((doctor) => doctor.specialty === specialty) }))
    .filter(({ people }) => people.length > 0)
    .sort((a, b) => b.people.length - a.people.length);

  return (
    <section className={styles.banner} aria-label="Care team overview">
      <div className={styles.intro}>
        <p className={styles.figure} aria-hidden>
          {doctors.length}
        </p>
        <div>
          <h2>{title}</h2>
          <p>{summary}</p>
        </div>
      </div>

      <ul className={styles.groups}>
        {groups.map(({ specialty, people }) => (
          <li key={specialty} data-tone={specialtyTone[specialty]}>
            <span className={styles.faces} aria-hidden>
              {people.map((doctor) => (
                <span key={doctor.id} className={styles.face}>
                  <Avatar name={doctor.name} src={doctor.photo} size={28} />
                </span>
              ))}
            </span>
            <span className={styles.label}>
              {specialty}
              <b>{people.length}</b>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
