import { Card } from "@/components/ui/card";
import type { Doctor } from "./data";
import styles from "./doctors.module.css";

/** Who is working: a dot per doctor (filled when active), then three supporting figures. */
export function TeamOverview({ doctors }: { doctors: readonly Doctor[] }) {
  const active = doctors.filter((doctor) => doctor.status === "Active").length;
  const rated = doctors.filter((doctor) => doctor.rating > 0);
  const rating = rated.length ? (rated.reduce((sum, doctor) => sum + doctor.rating, 0) / rated.length).toFixed(1) : "–";
  const patients = doctors.reduce((sum, doctor) => sum + doctor.patients, 0);
  const specialties = new Set(doctors.map((doctor) => doctor.specialty)).size;

  const facts = [
    { label: "Specialties", value: specialties },
    { label: "Avg. rating", value: rating },
    { label: "Patients", value: patients.toLocaleString("en-US") },
  ];

  return (
    <Card rounded title="Team Overview" description="Your doctors at a glance">
      <p className={styles.overviewHero}>
        <span className={styles.overviewFigure}>{active}</span>
        <span className="text-small text-muted">of {doctors.length} doctors active</span>
      </p>
      <ul className={styles.dots} role="img" aria-label={`${active} of ${doctors.length} doctors active`}>
        {doctors.map((doctor) => (
          <li key={doctor.id} data-on={doctor.status === "Active" ? "" : undefined} />
        ))}
      </ul>
      <dl className={styles.facts}>
        {facts.map(({ label, value }) => (
          <div key={label}>
            <dd>{value}</dd>
            <dt>{label}</dt>
          </div>
        ))}
      </dl>
    </Card>
  );
}
