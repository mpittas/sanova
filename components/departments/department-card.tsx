import { LuArrowRight } from "react-icons/lu";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ToneTile } from "@/components/ui/tone-tile";
import type { Department } from "./data";
import styles from "./departments.module.css";

const SHOWN_FACES = 3;

export function DepartmentCard({ department }: { department: Department }) {
  const { name, tone, icon: Icon, description, doctors, patients, satisfaction, team } = department;
  const more = doctors - SHOWN_FACES;

  return (
    <article className={styles.card} data-tone={tone}>
      <div className={styles.art}>
        {/* Decorative: soft rings with the department's icon, in its colour. */}
        <span className={styles.ring} aria-hidden>
          <Icon />
        </span>

        <div className={styles.artText}>
          <ToneTile tone={tone} size={48}>
            <Icon />
          </ToneTile>
          <div>
            <h3 className="text-h4">{name}</h3>
            <p className="text-small text-muted">{description}</p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          iconOnly
          href="/doctors"
          className={styles.open}
          aria-label={`View ${name} doctors`}
        >
          <LuArrowRight />
        </Button>
      </div>

      <div className={styles.footer}>
        <dl className={styles.figures}>
          <div>
            <dd className="text-label num">{doctors}</dd>
            <dt className="text-caption text-muted">Doctors</dt>
          </div>
          <div>
            <dd className="text-label num">{patients}</dd>
            <dt className="text-caption text-muted">Active Patients</dt>
          </div>
          <div>
            <dd className="text-label num">{satisfaction}%</dd>
            <dt className="text-caption text-muted">Satisfaction</dt>
          </div>
        </dl>

        <div className={styles.faces} role="img" aria-label={`${doctors} doctors`}>
          {team.slice(0, SHOWN_FACES).map((photo) => (
            <span key={photo} className={styles.face}>
              <Avatar name={name} src={photo} size={30} />
            </span>
          ))}
          {more > 0 && <span className={`${styles.face} ${styles.more} num`}>+{more}</span>}
        </div>
      </div>
    </article>
  );
}
