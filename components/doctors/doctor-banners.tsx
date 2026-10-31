import type { CSSProperties } from "react";
import { LuArrowUpRight, LuPlus } from "react-icons/lu";
import { TODAY } from "@/components/appointments/data";
import { addDays, formatDate, formatTime } from "@/components/appointments/dates";
import { Avatar } from "@/components/ui/avatar";
import { doctors, specialties, specialtyTone, type Doctor } from "./data";
import styles from "./doctor-banners.module.css";

const byTime = (a: Doctor, b: Doctor) => a.next.time.localeCompare(b.next.time);
const active = doctors.filter((doctor) => doctor.status === "Active");
const today = active.filter((doctor) => doctor.next.date === TODAY).sort(byTime);
const tomorrow = active.filter((doctor) => doctor.next.date === addDays(TODAY, 1)).sort(byTime);
const away = doctors.filter((doctor) => doctor.status === "On Leave").sort((a, b) => a.next.date.localeCompare(b.next.date));
const specialtyCount = new Set(doctors.map((doctor) => doctor.specialty)).size;
const summary = `${doctors.length} doctors across ${specialtyCount} specialties.`;
const averageRating = doctors.reduce((sum, doctor) => sum + doctor.rating, 0) / doctors.length;
const next = today[0];

const mix = specialties
  .map((specialty) => [specialty, doctors.filter((doctor) => doctor.specialty === specialty).length] as const)
  .sort((a, b) => b[1] - a[1]);

const floorOf = (doctor: Doctor) => parseInt(doctor.location.floor, 10);
const wings = ["West Wing", "Main Clinic", "East Wing"].map((site) => {
  const here = doctors.filter((doctor) => doctor.location.site === site);
  const top = Math.max(...here.map(floorOf));
  const floors = Array.from({ length: top }, (_, i) => top - i).map((floor) => ({ floor, people: here.filter((doctor) => floorOf(doctor) === floor) }));
  return { site, floors };
});

// Orbit: grouped by specialty so each colour reads as one arc.
const grouped = [...doctors].sort((a, b) => specialties.indexOf(a.specialty) - specialties.indexOf(b.specialty));
const rings = [
  { ring: "outer", people: grouped.slice(0, 9) },
  { ring: "inner", people: grouped.slice(9) },
];

// Card fan: the next free doctor in the middle, the rest of today's openings fanned out on either side.
const fanOrder = [0, 1, -1, 2, -2];
const fan = today.slice(0, 5).map((doctor, index) => ({ doctor, offset: fanOrder[index] }));

const lanes = [
  { id: "today", label: "Today", note: formatDate(TODAY, { weekday: "short", day: "numeric", month: "short" }), tone: "primary", people: today, live: true },
  { id: "tomorrow", label: "Tomorrow", note: formatDate(addDays(TODAY, 1), { weekday: "short", day: "numeric", month: "short" }), tone: "blue", people: tomorrow },
  { id: "away", label: "On leave", note: "Back soon", tone: undefined, people: away },
];

const half = Math.ceil(doctors.length / 2);
const tracks = [doctors.slice(0, half), doctors.slice(half)];

function Chip({ doctor }: { doctor: Doctor }) {
  const freeToday = doctor.status === "Active" && doctor.next.date === TODAY;
  return (
    <>
      <Avatar name={doctor.name} src={doctor.photo} size={34} />
      <span className={styles.chipText}>
        <strong>{doctor.name}</strong>
        <small data-tone={specialtyTone[doctor.specialty]}><i />{doctor.specialty}</small>
      </span>
      {freeToday && <span className={styles.free}>{formatTime(doctor.next.time)}</span>}
    </>
  );
}

const options = [
  {
    label: "Clinic directory",
    note: "Where everyone is: the three buildings drawn as a skyline, each floor with the doctors who work on it. Doctors on leave are greyed out.",
    banner: (
      <section className={`${styles.banner} ${styles.directory}`} aria-label="Care team overview">
        <div className={styles.directoryText}>
          <h2>Your care team</h2>
          <p>{summary} Spread over three buildings and eight floors.</p>
          <ul className={styles.key}>
            <li data-tone="primary"><i />{active.length} in clinic</li>
            <li><i />{away.length} on leave</li>
          </ul>
          <button type="button" className={styles.link}>Open floor plan <LuArrowUpRight aria-hidden /></button>
        </div>
        <div className={styles.building}>
          {wings.map(({ site, floors }) => (
            <div key={site} className={styles.wing} data-main={site === "Main Clinic" || undefined}>
              <span className={styles.wingName}>{site === "Main Clinic" && <LuPlus aria-hidden />}{site}</span>
              <ol className={styles.floors}>
                {floors.map(({ floor, people }) => (
                  <li key={floor} style={{ "--i": floor } as CSSProperties}>
                    <span className={styles.floorNo}>{floor}F</span>
                    <span className={styles.people}>
                      {people.map((doctor) => (
                        <span key={doctor.id} title={`${doctor.name} · ${doctor.specialty}`} data-away={doctor.status === "On Leave" || undefined}>
                          <Avatar name={doctor.name} src={doctor.photo} size={28} />
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>
    ),
  },
  {
    label: "Orbit",
    note: "The whole team at a glance on the brand's deep green. Portraits circle the headcount slowly, ringed in their specialty colour; hover to pause.",
    banner: (
      <section className={`${styles.banner} ${styles.orbit}`} aria-label="Care team overview">
        <div>
          <h2>Your care team</h2>
          <p>{summary}</p>
          <div className={styles.pills}>
            <span className={styles.pill}><i />{today.length} free today</span>
            <span className={styles.pill}><i data-off />{away.length} on leave</span>
          </div>
        </div>
        <div className={styles.sky} aria-hidden>
          <span className={styles.ring} data-ring="outer" />
          <span className={styles.ring} data-ring="inner" />
          <span className={styles.hub}><b>{doctors.length}</b>doctors</span>
          <ul className={styles.spin}>
            {rings.flatMap(({ ring, people }) =>
              people.map((doctor, index) => (
                <li key={doctor.id} data-ring={ring} data-tone={specialtyTone[doctor.specialty]} style={{ "--a": `${(index / people.length) * 360 - 90}deg` } as CSSProperties}>
                  <span><Avatar name={doctor.name} src={doctor.photo} size={ring === "outer" ? 34 : 30} /></span>
                </li>
              )),
            )}
          </ul>
        </div>
        <ul className={styles.orbitLegend} aria-label="Specialties">
          {mix.map(([specialty, count]) => (
            <li key={specialty} data-tone={specialtyTone[specialty]}><i />{specialty}<b>{count}</b></li>
          ))}
        </ul>
      </section>
    ),
  },
  {
    label: "Card fan",
    note: "Today's openings dealt like a hand of cards, the next free doctor on top. The fan opens wider on hover and each card lifts.",
    banner: (
      <section className={`${styles.banner} ${styles.fan}`} aria-label="Care team overview">
        <div className={styles.fanText}>
          <h2>Your care team</h2>
          <p>{summary} {today.length} of them still have time today.</p>
          {next && (
            <span className={styles.nextUp}>
              <Avatar name={next.name} src={next.photo} size={28} />
              <span>Next free <strong>{formatTime(next.next.time)}</strong> · {next.name}</span>
            </span>
          )}
          <button type="button" className={styles.link}>See today&apos;s openings <LuArrowUpRight aria-hidden /></button>
        </div>
        <div className={styles.deck}>
          {fan.map(({ doctor, offset }) => (
            <article
              key={doctor.id}
              className={styles.card}
              data-next={offset === 0 || undefined}
              style={{ "--o": offset, "--lift": Math.abs(offset) } as CSSProperties}
              aria-label={`${doctor.name}, ${doctor.specialty}, free at ${formatTime(doctor.next.time)}`}
            >
              <Avatar name={doctor.name} src={doctor.photo} size={116} shape="rounded" radius={11} />
              {offset === 0 && <span className={styles.badge}>Next free</span>}
              <strong>{doctor.name}</strong>
              <small data-tone={specialtyTone[doctor.specialty]}><i />{doctor.specialty}</small>
              <em>{formatTime(doctor.next.time)}</em>
            </article>
          ))}
        </div>
      </section>
    ),
  },
  {
    label: "Next openings",
    note: "Practical and calm: three lanes for today, tomorrow and on leave, each listing who is free first. Answers \"who can I book?\" before the list does.",
    banner: (
      <section className={`${styles.banner} ${styles.openings}`} aria-label="Care team overview">
        <div className={styles.openingsHead}>
          <div>
            <h2>Your care team</h2>
            <p>{summary}</p>
          </div>
          {next && (
            <span className={styles.earliest}>
              <Avatar name={next.name} src={next.photo} size={32} />
              <span>Earliest opening<b>{formatTime(next.next.time)} today</b></span>
            </span>
          )}
        </div>
        <ul className={styles.lanes}>
          {lanes.map(({ id, label, note, tone, people, live }) => (
            <li key={id} className={styles.lane} data-tone={tone} data-live={live || undefined} data-away={id === "away" || undefined}>
              <span className={styles.laneHead}><i />{label}<span className={styles.laneCount}>{people.length}</span><small>{note}</small></span>
              {people.slice(0, 3).map((doctor, index) => (
                <span key={doctor.id} className={styles.row} style={{ "--i": index } as CSSProperties}>
                  <Avatar name={doctor.name} src={doctor.photo} size={30} />
                  <span className={styles.rowText}><strong>{doctor.name}</strong><small>{doctor.specialty}</small></span>
                  <span className={styles.rowTime}>{id === "away" ? formatDate(doctor.next.date, { day: "numeric", month: "short" }) : formatTime(doctor.next.time)}</span>
                </span>
              ))}
              {people.length > 3 && <button type="button" className={styles.more}>+{people.length - 3} more</button>}
            </li>
          ))}
        </ul>
      </section>
    ),
  },
  {
    label: "Name marquee",
    note: "Lively and light: the whole team glides past in two rows going opposite ways, with today's free time on each chip. Hover to stop it.",
    banner: (
      <section className={`${styles.banner} ${styles.marquee}`} aria-label="Care team overview">
        <div className={styles.marqueeHead}>
          <div>
            <h2>Your care team</h2>
            <p>Everyone who looks after your patients, in one place.</p>
          </div>
          <dl className={styles.figures}>
            <div><dt>doctors</dt><dd>{doctors.length}</dd></div>
            <div><dt>specialties</dt><dd>{specialtyCount}</dd></div>
            <div><dt>average rating</dt><dd>{averageRating.toFixed(1)}</dd></div>
          </dl>
        </div>
        <div className={styles.tracks}>
          {tracks.map((people, row) => (
            <ul key={row} className={styles.track} data-reverse={row === 1 || undefined}>
              {/* The row is drawn twice so it can loop without a gap; the copy is hidden from screen readers. */}
              {[...people, ...people].map((doctor, index) => (
                <li key={`${doctor.id}-${index}`} aria-hidden={index >= people.length || undefined}>
                  <Chip doctor={doctor} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>
    ),
  },
];

/** The first round of banner designs, kept below the newer round at /demo-banner. */
export function DoctorBanners() {
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
