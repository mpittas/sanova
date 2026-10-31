import type { CSSProperties } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import { TODAY } from "@/components/appointments/data";
import { formatDate, formatTime } from "@/components/appointments/dates";
import { Avatar } from "@/components/ui/avatar";
import { doctors, specialties, specialtyTone, type Doctor } from "./data";
import styles from "./care-team-banners.module.css";

const byTime = (a: Doctor, b: Doctor) => a.next.time.localeCompare(b.next.time);
const freeToday = doctors.filter((doctor) => doctor.status === "Active" && doctor.next.date === TODAY).sort(byTime);
const onLeave = doctors.filter((doctor) => doctor.status === "On Leave");
const specialtyCount = new Set(doctors.map((doctor) => doctor.specialty)).size;
const next = freeToday[0];
const dayName = formatDate(TODAY, { weekday: "long", month: "long", day: "numeric" });

const mix = specialties
  .map((specialty) => ({ specialty, count: doctors.filter((doctor) => doctor.specialty === specialty).length }))
  .filter(({ count }) => count > 0)
  .sort((a, b) => b.count - a.count);

/** Today's line runs 8 AM to 6 PM; the clock is a quarter past ten. */
const DAY = [8 * 60, 18 * 60];
const NOW = "10:15";
const along = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours * 60 + minutes - DAY[0]) / (DAY[1] - DAY[0]);
};
// Openings closer than this share of the line sit on a taller stem, so neighbouring portraits never overlap.
const pins = freeToday.reduce<{ doctor: Doctor; at: number; tall: boolean }[]>((list, doctor) => {
  const at = along(doctor.next.time);
  const before = list[list.length - 1];
  list.push({ doctor, at, tall: !!before && !before.tall && at - before.at < 0.09 });
  return list;
}, []);

const options = [
  {
    label: "Faces",
    note: "The team as one quiet row of portraits on pale pearl. Hover the row and it opens out on a spring; doctors on leave are greyed.",
    banner: (
      <section className={`${styles.banner} ${styles.faces}`} aria-label="Care team overview">
        <div>
          <h2>Your care team</h2>
          <p>{doctors.length} doctors across {specialtyCount} specialties. {freeToday.length} can still see patients today.</p>
          <button type="button" className={styles.link}>View all doctors <LuArrowUpRight aria-hidden /></button>
        </div>
        <div className={styles.faceGroup}>
          <ul className={styles.faceRow} aria-label="Doctors">
            {doctors.map((doctor, index) => (
              <li key={doctor.id} title={doctor.name} data-away={doctor.status === "On Leave" || undefined} style={{ "--i": index } as CSSProperties}>
                <Avatar name={doctor.name} src={doctor.photo} size={44} />
              </li>
            ))}
          </ul>
          <p className={styles.faceNote}>{freeToday.length} free today, {onLeave.length} on leave</p>
        </div>
      </section>
    ),
  },
  {
    label: "One sentence",
    note: "No widgets at all: the headline answers the question people open this page with, and the faces of who is free sit inside it.",
    banner: (
      <section className={`${styles.banner} ${styles.sentence}`} aria-label="Care team overview">
        <h2>
          {freeToday.length} of your {doctors.length} doctors{" "}
          <span className={styles.inlineFaces} aria-hidden>
            {freeToday.map((doctor) => <Avatar key={doctor.id} name={doctor.name} src={doctor.photo} size={34} />)}
          </span>{" "}
          can still see patients today.
        </h2>
        {next && <p>The earliest opening is {formatTime(next.next.time)} with {next.name}.</p>}
        <button type="button" className={styles.link}>See today&apos;s openings <LuArrowUpRight aria-hidden /></button>
      </section>
    ),
  },
  {
    label: "Next opening",
    note: "The brand's emerald ribbon carries one frosted card: the next doctor you can book, and a button to book them.",
    banner: next && (
      <section className={`${styles.banner} ${styles.ribbon}`} aria-label="Care team overview">
        <div>
          <h2>Your care team</h2>
          <p>{doctors.length} doctors across {specialtyCount} specialties, {freeToday.length} with time left today.</p>
        </div>
        <article className={styles.glass} aria-label="Next opening">
          <Avatar name={next.name} src={next.photo} size={56} shape="rounded" radius={14} />
          <div className={styles.glassText}>
            <span>Next opening</span>
            <strong>{formatTime(next.next.time)}</strong>
            <small>{next.name}, {next.title}</small>
          </div>
          <button type="button" className={styles.book}>Book</button>
        </article>
      </section>
    ),
  },
  {
    label: "Today's line",
    note: "The clinic day as a single line. The part already gone is solid, and each doctor with an opening sits where their time falls.",
    banner: (
      <section className={`${styles.banner} ${styles.line}`} aria-label="Care team overview">
        <div className={styles.lineHead}>
          <div>
            <h2>Your care team</h2>
            <p>{freeToday.length} of {doctors.length} doctors have an opening left today.</p>
          </div>
          <span className={styles.date}>{dayName}</span>
        </div>
        <div className={styles.day} style={{ "--now": along(NOW) } as CSSProperties}>
          <span className={styles.rail} aria-hidden />
          <ol className={styles.pins}>
            {pins.map(({ doctor, at, tall }, index) => (
              <li
                key={doctor.id}
                title={`${doctor.name}, free at ${formatTime(doctor.next.time)}`}
                data-tall={tall || undefined}
                style={{ "--at": at, "--i": index } as CSSProperties}
              >
                <Avatar name={doctor.name} src={doctor.photo} size={34} />
                <time dateTime={doctor.next.time}>{formatTime(doctor.next.time).replace(/ [AP]M$/, "")}</time>
              </li>
            ))}
          </ol>
          <p className={styles.hours} aria-hidden><span>8 AM</span><span>6 PM</span></p>
        </div>
      </section>
    ),
  },
  {
    label: "Specialty spectrum",
    note: "Deep forest green with one thin bar: each specialty's share of the team in its own colour. Hover a segment to bring it forward.",
    banner: (
      <section className={`${styles.banner} ${styles.spectrum}`} aria-label="Care team overview">
        <div>
          <h2>Your care team</h2>
          <p>{doctors.length} doctors across {specialtyCount} specialties.</p>
        </div>
        <ul className={styles.bar} aria-label="Doctors by specialty">
          {mix.map(({ specialty, count }, index) => (
            <li key={specialty} data-tone={specialtyTone[specialty]} style={{ "--count": count, "--i": index } as CSSProperties}>
              <i aria-hidden />
              <span>{specialty}<b>{count}</b></span>
            </li>
          ))}
        </ul>
      </section>
    ),
  },
];

/** Five calmer designs for the banner at the top of Doctors, each with one idea. Open at /demo-banner. */
export function CareTeamBanners() {
  return (
    <ol className={styles.list}>
      {options.map(({ label, note, banner }, index) => (
        <li key={label} className={styles.item}>
          <p className={styles.caption}><span className={styles.index}>{index + 1}</span><span className="text-label">{label}</span></p>
          <p className="text-small text-muted">{note}</p>
          {banner}
        </li>
      ))}
    </ol>
  );
}
