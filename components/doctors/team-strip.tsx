import { LuArrowUpRight, LuCalendarCheck, LuCoffee } from "react-icons/lu";
import { TODAY } from "@/components/appointments/data";
import { Avatar } from "@/components/ui/avatar";
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
      <div className={styles.bannerTeam}>
        <div><h2>Your care team</h2><p>{doctors.length} doctors across {specialties} specialties.</p></div>
        <div className={styles.bannerPeople}>
          <ul className={styles.stack} aria-hidden>{doctors.slice(0, 4).map((doctor) => <li key={doctor.id}><Avatar name={doctor.name} src={doctor.photo} size={32} /></li>)}</ul>
          <button type="button" onClick={onShowAll}>View all doctors <LuArrowUpRight aria-hidden /></button>
        </div>
      </div>
      <div className={styles.bannerQueues}>
        <button type="button" className={styles.queue} aria-label="Show doctors available today" aria-pressed={availableSelected} onClick={onShowAvailable}>
          <span className={styles.queueTop}><LuCalendarCheck aria-hidden /><LuArrowUpRight aria-hidden /></span>
          <span className={styles.queueValue}>{availableToday}<span>Available today</span></span>
        </button>
        <button type="button" className={styles.queue} aria-label="Show doctors on leave" aria-pressed={leaveSelected} onClick={onShowLeave}>
          <span className={styles.queueTop}><LuCoffee aria-hidden /><LuArrowUpRight aria-hidden /></span>
          <span className={styles.queueValue}>{onLeave}<span>On leave</span></span>
        </button>
      </div>
    </section>
  );
}