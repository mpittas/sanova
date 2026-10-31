import type { CSSProperties } from "react";
import { LuArrowLeft, LuArrowRight, LuArrowUp } from "react-icons/lu";
import { TODAY } from "@/components/appointments/data";
import { addDays, formatDate, formatTime } from "@/components/appointments/dates";
import { Avatar } from "@/components/ui/avatar";
import { doctors, specialties, specialtyTone, type Doctor } from "./data";
import styles from "./team-banners.module.css";

const byWhen = (a: Doctor, b: Doctor) => `${a.next.date}${a.next.time}`.localeCompare(`${b.next.date}${b.next.time}`);
const inClinic = doctors.filter((doctor) => doctor.status === "Active");
const freeToday = inClinic.filter((doctor) => doctor.next.date === TODAY).sort(byWhen);
const onLeave = doctors.filter((doctor) => doctor.status === "On Leave");
const totalPatients = doctors.reduce((sum, doctor) => sum + doctor.patients, 0);
const NOW = "10:15";

const plain = (name: string) => name.replace(/^Dr\.?\s+/, "");
const firstName = (doctor: Doctor) => plain(doctor.name).split(" ")[0];
const lastName = (doctor: Doctor) => plain(doctor.name).split(" ").slice(-1)[0];
const floorOf = (doctor: Doctor) => parseInt(doctor.location.floor, 10);
const sr = (text: string) => <span className={styles.sr}>{text}</span>;

// ---------- 1. Departures board ----------

const boardRows = freeToday.slice(0, 3);

function Flaps({ text, row }: { text: string; row: number }) {
  return (
    <span className={styles.flaps} aria-hidden>
      {[...text].map((char, index) => (
        <b key={index} style={{ "--k": index, "--row": row } as CSSProperties}>{char}</b>
      ))}
    </span>
  );
}

// ---------- 2. Pulse ----------

const BEAT_W = 1000 / doctors.length;
const BASE = 128;
const topPatients = Math.max(...doctors.map((doctor) => doctor.patients));
const beats = doctors.map((doctor, index) => {
  const x0 = index * BEAT_W;
  const peak = BASE - (22 + (doctor.patients / topPatients) * 84);
  return { doctor, x0, peak, x: (x0 + BEAT_W * 0.5) / 10, y: (peak / 150) * 100 };
});
const trace = [
  `M0,${BASE}`,
  ...beats.flatMap(({ x0, peak }) =>
    [
      [0.14, BASE], [0.19, BASE - 8], [0.25, BASE], [0.38, BASE], [0.43, BASE + 10], [0.5, peak],
      [0.57, BASE + 16], [0.62, BASE], [0.75, BASE], [0.82, BASE - 12], [0.9, BASE], [1, BASE],
    ].map(([at, y]) => `L${(x0 + BEAT_W * at).toFixed(1)},${y}`),
  ),
].join(" ");

// ---------- 3. Constellation ----------

const X_RANGE = [4, 16];
const Y_RANGE = [4.55, 4.95];
const plotX = (years: number) => ((years - X_RANGE[0]) / (X_RANGE[1] - X_RANGE[0])) * 100;
const plotY = (rating: number) => ((rating - Y_RANGE[0]) / (Y_RANGE[1] - Y_RANGE[0])) * 100;
const averageRating = doctors.reduce((sum, doctor) => sum + doctor.rating, 0) / doctors.length;
const RATINGS = [4.6, 4.7, 4.8, 4.9];
const careerNote = (doctor: Doctor) => `${doctor.name}, ${doctor.specialty}: ${doctor.experience} years, rated ${doctor.rating}`;

// ---------- 4. Milestones ----------

const THIS_YEAR = Number(TODAY.slice(0, 4));
// Half a year of slack each side keeps the first and last nodes off the panel edge.
const SINCE = [2008.4, 2019.6];
const startYear = (doctor: Doctor) => THIS_YEAR - doctor.experience;
const sinceX = (year: number) => ((year - SINCE[0]) / (SINCE[1] - SINCE[0])) * 100;
/** One node per start year on the rail. A lone doctor alternates above and below; two from the same year split. */
const milestones = [...new Set(doctors.map(startYear))]
  .sort((a, b) => a - b)
  .map((year, index) => {
    const people = doctors.filter((doctor) => startYear(doctor) === year);
    return {
      year,
      x: sinceX(year),
      people: people.map((doctor, k) => ({ doctor, side: (people.length > 1 ? k : index) % 2 ? "down" : "up" })),
    };
  });

// ---------- 5. Building lanes ----------

/** Same-site doctors with equal experience nudge apart so their portraits overlap like a small stack. */
const lanes = ["Main Clinic", "West Wing", "East Wing"].map((site) => {
  const here = doctors.filter((doctor) => doctor.location.site === site).sort((a, b) => a.experience - b.experience);
  return {
    site,
    people: here.map((doctor) => {
      const twins = here.filter((other) => other.experience === doctor.experience);
      const nudge = (twins.indexOf(doctor) - (twins.length - 1) / 2) * 0.6;
      return { doctor, x: plotX(doctor.experience + nudge) };
    }),
  };
});

// ---------- 6. Skyline ----------

const SKY_TOP = 16;
const skyline = [...doctors].sort((a, b) => a.experience - b.experience || b.rating - a.rating);
const totalYears = doctors.reduce((sum, doctor) => sum + doctor.experience, 0);

// ---------- 8. Wayfinding ----------

const signs = [
  { site: "West Wing", Icon: LuArrowLeft, dir: "left" },
  { site: "Main Clinic", Icon: LuArrowUp, dir: "up" },
  { site: "East Wing", Icon: LuArrowRight, dir: "right" },
].map(({ site, Icon, dir }) => {
  const here = doctors.filter((doctor) => doctor.location.site === site);
  const floors = here.map(floorOf);
  const low = Math.min(...floors);
  const high = Math.max(...floors);
  return {
    site,
    Icon,
    dir,
    count: here.length,
    levels: low === high ? `Floor ${low}` : `Floors ${low}–${high}`,
    here: [...new Set(here.map((doctor) => doctor.specialty))],
  };
});

// ---------- 10. Periodic table ----------

const groups = specialties
  .map((specialty) => ({ specialty, people: doctors.filter((doctor) => doctor.specialty === specialty) }))
  .filter(({ people }) => people.length > 0);

// ---------- 11. Picker ----------

const when = (doctor: Doctor) =>
  doctor.next.date === TODAY ? "today" : doctor.next.date === addDays(TODAY, 1) ? "tomorrow" : formatDate(doctor.next.date, { day: "numeric", month: "short" });
const picks = groups.map(({ specialty, people }) => {
  const open = people.filter((doctor) => doctor.status === "Active").sort(byWhen)[0];
  return {
    specialty,
    tone: specialtyTone[specialty],
    count: people.length,
    answer: open ? `${open.name} is free ${when(open)} at ${formatTime(open.next.time)}.` : "Nobody is free right now.",
  };
});

// ---------- 12. Day gauge ----------

/** The clinic day runs 8 AM to 6 PM along a half dial: 0 is the left end, 1 the right. */
const DAY = [8, 18];
const along = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours + minutes / 60 - DAY[0]) / (DAY[1] - DAY[0]);
};
const sweep = (share: number) => -90 + share * 180;
const GAUGE_RADII = [0.8, 0.52];
const pins = freeToday.map((doctor, index) => {
  const angle = (sweep(along(doctor.next.time)) * Math.PI) / 180;
  const radius = GAUGE_RADII[index % 2];
  return { doctor, x: 50 + radius * 50 * Math.sin(angle), y: 100 - radius * 100 * Math.cos(angle) };
});

// ---------- 13. Index ----------

const entries = [...groups].sort((a, b) => b.people.length - a.people.length);

const options = [
  {
    label: "Departures board",
    note: "Today's next three openings on a split-flap board. Time and floor flip into place when the page loads.",
    banner: (
      <section className={`${styles.banner} ${styles.board}`} aria-label="Care team overview">
        <div>
          <h2>Your care team</h2>
          <p>{doctors.length} doctors, {freeToday.length} with an opening left today.</p>
        </div>
        <ol className={styles.panel}>
          {boardRows.map((doctor, row) => {
            const [clock, meridiem] = formatTime(doctor.next.time).split(" ");
            return (
              <li key={doctor.id} data-next={row === 0 || undefined} style={{ "--row": row } as CSSProperties}>
                {sr(`${doctor.name}, ${doctor.specialty}, free ${when(doctor)} at ${formatTime(doctor.next.time)}, ${doctor.location.floor}`)}
                <span className={styles.when}><Flaps text={clock.padStart(5, " ")} row={row} /><Flaps text={meridiem} row={row} /></span>
                <span className={styles.who} aria-hidden><strong>{doctor.name}</strong><small>{doctor.specialty}</small></span>
                <Flaps text={`${floorOf(doctor)}F`} row={row} />
                <span className={styles.status} aria-hidden><i />{row === 0 ? "Next" : "Open"}</span>
              </li>
            );
          })}
        </ol>
      </section>
    ),
  },
  {
    label: "Pulse",
    note: "A heart-monitor trace with one beat per doctor. A taller beat means a bigger patient list, and each portrait rides its own peak.",
    banner: (
      <section className={`${styles.banner} ${styles.pulse}`} aria-label="Care team overview">
        <div>
          <h2>Your care team</h2>
          <p>{totalPatients.toLocaleString("en-US")} patients between {doctors.length} doctors. Taller beats are bigger lists.</p>
        </div>
        <div className={styles.monitor}>
          <svg viewBox="0 0 1000 150" preserveAspectRatio="none" aria-hidden>
            <path d={trace} pathLength={1} />
          </svg>
          <ul aria-label="Patients per doctor">
            {beats.map(({ doctor, x, y }) => (
              <li key={doctor.id} title={`${doctor.name}, ${doctor.patients} patients`} data-away={doctor.status === "On Leave" || undefined} style={{ "--x": x, "--y": y } as CSSProperties}>
                <Avatar name={doctor.name} src={doctor.photo} size={26} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    ),
  },
  {
    label: "Constellation",
    note: "Every doctor plotted by years in practice (across) and patient rating (up), ringed in their specialty colour. Dashed line: team average.",
    banner: (
      <section className={`${styles.banner} ${styles.timeline}`} aria-label="Care team overview">
        <div>
          <h2>Your care team</h2>
          <p>{doctors.length} doctors, rated {averageRating.toFixed(1)} on average.</p>
        </div>
        <div className={`${styles.chart} ${styles.plot}`}>
          <div className={styles.field}>
            {[5, 10, 15].map((years) => (
              <span key={years} className={styles.gridX} style={{ left: `${plotX(years)}%` }}><small>{years} yrs</small></span>
            ))}
            {RATINGS.map((rating) => (
              <span key={rating} className={styles.gridY} style={{ bottom: `${plotY(rating)}%` }}><small>{rating.toFixed(1)}</small></span>
            ))}
            <span className={styles.average} style={{ bottom: `${plotY(averageRating)}%` }}><small>Avg {averageRating.toFixed(1)}</small></span>
            {doctors.map((doctor) => (
              <span
                key={doctor.id}
                className={styles.orb}
                data-tone={specialtyTone[doctor.specialty]}
                data-away={doctor.status === "On Leave" || undefined}
                title={careerNote(doctor)}
                style={{ left: `${plotX(doctor.experience)}%`, bottom: `${plotY(doctor.rating)}%` }}
              >
                <Avatar name={doctor.name} src={doctor.photo} size={30} />
              </span>
            ))}
          </div>
        </div>
      </section>
    ),
  },
  {
    label: "Milestones",
    note: "The constellation as a timeline: one node per year the doctors started practising, portraits branching above and below the rail.",
    banner: (
      <section className={`${styles.banner} ${styles.timeline}`} aria-label="Care team overview">
        <div>
          <h2>Your care team</h2>
          <p>{doctors.length} doctors, practising since {milestones[0].year}.</p>
        </div>
        <div className={`${styles.chart} ${styles.journey}`}>
          <div className={styles.rail}>
            {milestones.map(({ year, x, people }, index) => (
              <div key={year} className={styles.milestone} style={{ left: `${x}%`, "--i": index } as CSSProperties}>
                {people.map(({ doctor, side }) => (
                  <span
                    key={doctor.id}
                    className={styles.orb}
                    data-side={side}
                    data-tone={specialtyTone[doctor.specialty]}
                    data-away={doctor.status === "On Leave" || undefined}
                    title={`${careerNote(doctor)}, since ${year}`}
                  >
                    <Avatar name={doctor.name} src={doctor.photo} size={32} />
                  </span>
                ))}
                <span className={styles.node}><span className={styles.century}>{String(year).slice(0, 2)}</span>{String(year).slice(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },
  {
    label: "Building lanes",
    note: "Years in practice along three soft tracks, one per building, so you see who is senior where. Doctors with equal years sit in a small stack.",
    banner: (
      <section className={`${styles.banner} ${styles.timeline}`} aria-label="Care team overview">
        <div>
          <h2>Your care team</h2>
          <p>{doctors.length} doctors in three buildings, by years in practice.</p>
        </div>
        <div className={`${styles.chart} ${styles.lanes}`}>
          {lanes.map(({ site, people }) => (
            <div key={site} className={styles.lane}>
              <span className={styles.laneName}>{site}<b>{people.length}</b></span>
              <div className={styles.track}>
                {people.map(({ doctor, x }) => (
                  <span
                    key={doctor.id}
                    className={styles.orb}
                    data-tone={specialtyTone[doctor.specialty]}
                    data-away={doctor.status === "On Leave" || undefined}
                    title={careerNote(doctor)}
                    style={{ left: `${x}%` }}
                  >
                    <Avatar name={doctor.name} src={doctor.photo} size={30} />
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div className={styles.lane} aria-hidden>
            <span />
            <div className={styles.laneTicks}>
              {[5, 10, 15].map((years) => (
                <small key={years} style={{ left: `${plotX(years)}%` }}>{years} yrs</small>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
  },
  {
    label: "Skyline",
    note: "Every doctor on a stem as tall as their years in practice, shortest to longest. The stems grow in when the page loads.",
    banner: (
      <section className={`${styles.banner} ${styles.timeline}`} aria-label="Care team overview">
        <div>
          <h2>Your care team</h2>
          <p>{totalYears} years of practice between {doctors.length} doctors.</p>
        </div>
        <div className={`${styles.chart} ${styles.skyline}`}>
          <div className={styles.skyField}>
            {[5, 10, 15].map((years) => (
              <span key={years} className={styles.gridY} style={{ bottom: `${(years / SKY_TOP) * 100}%` }}><small>{years}</small></span>
            ))}
            <ul aria-label="Years in practice">
              {skyline.map((doctor, index) => (
                <li
                  key={doctor.id}
                  data-tone={specialtyTone[doctor.specialty]}
                  title={careerNote(doctor)}
                  style={{ "--h": (doctor.experience / SKY_TOP) * 100, "--i": index } as CSSProperties}
                >
                  <span className={styles.stem} aria-hidden />
                  <span className={styles.orb} data-away={doctor.status === "On Leave" || undefined}>
                    <Avatar name={doctor.name} src={doctor.photo} size={30} />
                  </span>
                  <small>{doctor.experience}y</small>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    ),
  },
  {
    label: "Lanyards",
    note: "Today's openings as name badges on lanyards. They swing into place on load; hover a badge to set it swinging again.",
    banner: (
      <section className={`${styles.banner} ${styles.lanyards}`} aria-label="Care team overview">
        <div>
          <h2>Your care team</h2>
          <p>{doctors.length} doctors. These {freeToday.length} can still see patients today.</p>
        </div>
        <ul className={styles.hangers}>
          {freeToday.map((doctor, index) => (
            <li key={doctor.id} style={{ "--i": index, "--drop": `${12 + (index % 2) * 12}px` } as CSSProperties}>
              <div className={styles.hang}>
                <span className={styles.strap} aria-hidden />
                <span className={styles.clip} aria-hidden />
                <article className={styles.badge} data-tone={specialtyTone[doctor.specialty]} title={`${doctor.name}, ${doctor.title}`}>
                  <span className={styles.badgeRow}>
                    <Avatar name={doctor.name} src={doctor.photo} size={30} />
                    <strong>{lastName(doctor)}</strong>
                  </span>
                  <em>{formatTime(doctor.next.time)}</em>
                </article>
              </div>
            </li>
          ))}
        </ul>
      </section>
    ),
  },
  {
    label: "Wayfinding",
    note: "Hospital signage. Three signs side by side, each with an arrow, the floors and the specialties you will find in that building.",
    banner: (
      <section className={`${styles.banner} ${styles.signs}`} aria-label="Care team overview">
        <div>
          <h2>Your care team</h2>
          <p>{doctors.length} doctors in three buildings.</p>
        </div>
        <ul className={styles.signboard}>
          {signs.map(({ site, Icon, dir, count, levels, here }) => (
            <li key={site} data-dir={dir}>
              <span className={styles.arrow} aria-hidden><Icon /></span>
              <div>
                <strong>{site}</strong>
                <small>{levels} · {count} doctors</small>
              </div>
              <p>{here.join(", ")}</p>
            </li>
          ))}
        </ul>
      </section>
    ),
  },
  {
    label: "Blister pack",
    note: "The team pressed into one foil strip. Doctors on leave are empty pockets; hover a pocket to pop its portrait.",
    banner: (
      <section className={`${styles.banner} ${styles.blister}`} aria-label="Care team overview">
        <div>
          <h2>Your care team</h2>
          <p>{inClinic.length} in clinic, {onLeave.length} on leave. Take one as needed.</p>
        </div>
        <ul className={styles.pack} aria-label="Doctors">
          {doctors.map((doctor) => (
            <li key={doctor.id} title={doctor.status === "On Leave" ? `${doctor.name} is on leave` : doctor.name}>
              <span className={styles.dome} data-empty={doctor.status === "On Leave" || undefined}>
                {doctor.status === "Active" && <Avatar name={doctor.name} src={doctor.photo} size={28} />}
              </span>
            </li>
          ))}
        </ul>
      </section>
    ),
  },
  {
    label: "Periodic table",
    note: "Each doctor is an element in one row, grouped by specialty colour. Years in practice sit top left; hover a tile to see the face.",
    banner: (
      <section className={`${styles.banner} ${styles.elements}`} aria-label="Care team overview">
        <div>
          <h2>Your care team</h2>
          <p>{doctors.length} elements in {groups.length} groups.</p>
        </div>
        <ul className={styles.groups}>
          {groups.map(({ specialty, people }) => (
            <li key={specialty} className={styles.group} title={specialty}>
              {people.map((doctor) => (
                <article
                  key={doctor.id}
                  className={styles.tile}
                  data-tone={specialtyTone[specialty]}
                  data-away={doctor.status === "On Leave" || undefined}
                  title={`${doctor.name}, ${specialty}, ${doctor.experience} years, rated ${doctor.rating}`}
                >
                  <span className={styles.years}>{doctor.experience}</span>
                  <strong className={styles.symbol}>{firstName(doctor)[0]}{lastName(doctor)[0].toLowerCase()}</strong>
                  <span className={styles.tileFace}><Avatar name={doctor.name} src={doctor.photo} size={28} /></span>
                </article>
              ))}
            </li>
          ))}
        </ul>
      </section>
    ),
  },
  {
    label: "Specialty picker",
    note: "Choose who you need to see. The other portraits step back and the line underneath says who is free next. All CSS, no script.",
    banner: (
      <section className={`${styles.banner} ${styles.ask}`} aria-label="Care team overview">
        <div>
          <h2>Your care team</h2>
          <p>Who do you need to see?</p>
        </div>
        <fieldset className={styles.picks}>
          <legend className={styles.sr}>Specialty</legend>
          <label data-tone="primary">
            <input type="radio" name="care-team-pick" value="all" defaultChecked />
            <span>Everyone<b>{doctors.length}</b></span>
          </label>
          {picks.map(({ specialty, tone, count }) => (
            <label key={specialty} data-tone={tone}>
              <input type="radio" name="care-team-pick" value={tone} />
              <span><i />{specialty}<b>{count}</b></span>
            </label>
          ))}
        </fieldset>
        <div className={styles.askRow}>
          <ul className={styles.askFaces} aria-label="Doctors">
            {doctors.map((doctor) => (
              <li key={doctor.id} className={styles.face} data-tone={specialtyTone[doctor.specialty]} data-away={doctor.status === "On Leave" || undefined} title={`${doctor.name}, ${doctor.specialty}`}>
                <Avatar name={doctor.name} src={doctor.photo} size={28} />
              </li>
            ))}
          </ul>
          <div className={styles.answers} aria-live="polite">
            <p data-key="all">{doctors.length} doctors, {inClinic.length} in clinic. Pick a specialty to see who is free next.</p>
            {picks.map(({ tone, count, answer }) => (
              <p key={tone} data-key={tone}><strong>{count} {count === 1 ? "doctor" : "doctors"}.</strong> {answer}</p>
            ))}
          </div>
        </div>
      </section>
    ),
  },
  {
    label: "Day gauge",
    note: "The clinic day, 8 AM to 6 PM, on a half dial. Each portrait sits at the hour that doctor is free; the needle stands at the current time.",
    banner: (
      <section className={`${styles.banner} ${styles.watch}`} aria-label="Care team overview">
        <div>
          <h2>Your care team</h2>
          <p>{doctors.length} doctors, {freeToday.length} free for the rest of today. It is {formatTime(NOW)} now.</p>
        </div>
        <div className={styles.gauge} role="img" aria-label={`Openings today at ${freeToday.map((doctor) => formatTime(doctor.next.time)).join(", ")}`}>
          <span className={styles.disc} />
          <span className={styles.marks} />
          <span className={styles.end} data-end="start">8 AM</span>
          <span className={styles.end} data-end="finish">6 PM</span>
          <span className={styles.needle} style={{ "--r": `${sweep(along(NOW))}deg` } as CSSProperties} />
          <span className={styles.cap} />
          {pins.map(({ doctor, x, y }) => (
            <span key={doctor.id} className={styles.pin} data-time={formatTime(doctor.next.time)} style={{ "--x": x, "--y": y } as CSSProperties}>
              <Avatar name={doctor.name} src={doctor.photo} size={24} />
            </span>
          ))}
        </div>
      </section>
    ),
  },
  {
    label: "Index",
    note: "No pictures at all: a book-style index in two columns, dotted leaders from each specialty to the surnames under it, the count at the end.",
    banner: (
      <section className={`${styles.banner} ${styles.index2}`} aria-label="Care team overview">
        <div>
          <h2>Your care team</h2>
          <p>{doctors.length} doctors, indexed by specialty.</p>
        </div>
        <ul className={styles.entries}>
          {entries.map(({ specialty, people }) => (
            <li key={specialty} data-tone={specialtyTone[specialty]}>
              <i aria-hidden />
              <span className={styles.entry}>{specialty}</span>
              <span className={styles.leader} aria-hidden />
              <span className={styles.names}>{people.map(lastName).join(", ")}</span>
              <span className={styles.count}>{people.length}</span>
            </li>
          ))}
        </ul>
      </section>
    ),
  },
];

/** Third round: thirteen compact banners built from objects and places instead of more layouts of faces. Open at /demo-banner. */
export function TeamBanners() {
  return (
    <ol className={styles.list}>
      {options.map(({ label, note, banner }, index) => (
        <li key={label} className={styles.item}>
          <p className={styles.caption}><span className={styles.num}>{index + 1}</span><span className="text-label">{label}</span></p>
          <p className="text-small text-muted">{note}</p>
          {banner}
        </li>
      ))}
    </ol>
  );
}
