import { doctorByName } from "./data";
import styles from "./doctors.module.css";

const lineup = ["Dr. Olivia Bennett", "Dr. Noah Wilson", "Dr. Liam Carter"].map((name) => doctorByName(name)!);

/** Banner at the top of the page: a short welcome and three of the team, standing in arched frames. */
export function DoctorsHero() {
  return (
    <section className={styles.hero} aria-labelledby="doctors-hero-title">
      <div className={styles.heroText}>
        <h2 id="doctors-hero-title" className="text-display">
          Exceptional care starts with great people.
        </h2>
        <p className="text-body-lg text-muted">
          Manage your doctors, view their specialties and schedules, and keep the whole team in one place.
        </p>
      </div>

      <div className={styles.lineup} aria-hidden>
        {lineup.map((doctor) => (
          <span key={doctor.id} className={styles.arch}>
            {/* Small remote portraits: a plain <img> avoids image-optimizer setup for placeholder photos. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={doctor.photo} alt="" width={160} height={160} referrerPolicy="no-referrer" />
          </span>
        ))}
      </div>
    </section>
  );
}
