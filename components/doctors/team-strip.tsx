import { LuArrowUpRight, LuCalendarOff, LuStethoscope, LuUserCheck } from "react-icons/lu";
import { TODAY } from "@/components/appointments/data";
import type { Doctor } from "./data";
import styles from "./doctors.module.css";

type TeamStripProps = {
  doctors: readonly Doctor[];
  availableSelected: boolean;
  leaveSelected: boolean;
  onShowAvailable: () => void;
  onShowLeave: () => void;
  onShowAll: () => void;
};

/** A team overview that also offers direct access to the two availability queues. */
export function TeamStrip({ doctors, availableSelected, leaveSelected, onShowAvailable, onShowLeave, onShowAll }: TeamStripProps) {
  const availableToday = doctors.filter((doctor) => doctor.status === "Active" && doctor.next.date === TODAY).length;
  const onLeave = doctors.filter((doctor) => doctor.status === "On Leave").length;
  const specialties = new Set(doctors.map((doctor) => doctor.specialty)).size;

  return (
    <section className={styles.strip} aria-label="Care team overview">
      <div className={styles.bannerHead}>
        <span className={styles.bigFigure} aria-hidden>{doctors.length}</span>
        <div>
          <h2>Your care team</h2>
          <p>{doctors.length} doctors across {specialties} specialties.</p>
          <button type="button" className={styles.bannerLink} onClick={onShowAll}>View all doctors <LuArrowUpRight aria-hidden /></button>
        </div>
      </div>
      <div className={styles.bannerFacts}>
        <button type="button" className={styles.fact} aria-label="Show doctors available today" aria-pressed={availableSelected} onClick={onShowAvailable}>
          <LuUserCheck aria-hidden /><span>Available today</span><b>{availableToday}</b>
        </button>
        <button type="button" className={styles.fact} aria-label="Show doctors on leave" aria-pressed={leaveSelected} onClick={onShowLeave}>
          <LuCalendarOff aria-hidden /><span>On leave</span><b>{onLeave}</b>
        </button>
        <div className={styles.fact}><LuStethoscope aria-hidden /><span>Specialties</span><b>{specialties}</b></div>
      </div>
    </section>
  );
}
