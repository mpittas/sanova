import { PageHeader } from "@/components/layout/page-header";
import { artVariants, DepartmentArt } from "./department-art";
import { departments } from "./data";
import styles from "./art-options.module.css";

/** Every department with every backdrop option, so one can be picked per card. Open at /departments/art. */
export function ArtOptions() {
  return (
    <>
      <PageHeader
        title="Department artwork options"
        description="Eight backdrops and compositions for each 3D render. Pick one per department, then set it in department-card.tsx."
      />
      {departments.map(({ name, tone }) => (
        <section key={name} className={`glass ${styles.group}`} aria-label={name}>
          <h2 className="text-h4">{name}</h2>
          <ul className={styles.grid}>
            {artVariants.map(({ id, label, note }, index) => (
              <li key={id}>
                <DepartmentArt name={name} tone={tone} variant={id} className={styles.tile} />
                <p className={styles.caption}>
                  <span className={styles.index}>{index + 1}</span>
                  <span className="text-label">{label}</span>
                </p>
                <p className="text-small text-muted">{note}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
