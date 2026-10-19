import { LuArrowRight } from "react-icons/lu";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Department, DepartmentName } from "./data";
import { DepartmentArt, type ArtVariant } from "./department-art";
import styles from "./departments.module.css";

const SHOWN_FACES = 3;
/** Backdrop for each department's artwork: one pattern each, in the department's own colour. See all options at /departments/art. */
export const artChoice: Record<DepartmentName, ArtVariant> = {
  "General Practice": "rings",
  Cardiology: "glow",
  Dermatology: "dots",
  Pediatrics: "clouds",
  Orthopedics: "lines",
  Gynecology: "blobs",
};

export function DepartmentCard({ department }: { department: Department }) {
  const { name, tone, description, doctors, patients, satisfaction, team } = department;
  const more = doctors - SHOWN_FACES;

  return (
    <article className={`glass ${styles.card}`} data-tone={tone}>
      <div className={styles.cardBody}>
        <div className={styles.cardHeading}>
          <DepartmentArt name={name} tone={tone} compact />
          <div className={styles.artText}>
            <h3 className="text-h4">{name}</h3>
            <p className="text-small text-muted">{description}</p>
          </div>
        </div>
        <dl className={styles.figures}>
          <div>
            <dd className="text-label num">{doctors}</dd>
            <dt className="text-caption text-muted">Doctors</dt>
          </div>
          <div>
            <dd className="text-label num">{patients}</dd>
            <dt className="text-caption text-muted">Active Patients</dt>
          </div>
        </dl>
      </div>
      <div className={styles.footer}>
        <div className={styles.faces} role="img" aria-label={`${doctors} doctors`}>
          {team.slice(0, SHOWN_FACES).map((photo) => (
            <span key={photo} className={styles.face}>
              <Avatar name={name} src={photo} size={28} />
            </span>
          ))}
          {more > 0 && <span className={`${styles.face} ${styles.more} num`}>+{more}</span>}
        </div>
        <span className={styles.satisfaction}>{satisfaction}% satisfaction</span>
        <Button variant="ghost" size="sm" iconOnly href="/doctors" className={styles.open} aria-label={`View ${name} doctors`}><LuArrowRight /></Button>
      </div>
    </article>
  );
}

