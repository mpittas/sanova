import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import { Card } from "@/components/ui/card";
import { CountUp } from "@/components/ui/count-up";
import { Delta } from "@/components/ui/delta";
import { ToneTile } from "@/components/ui/tone-tile";
import { stats } from "./data";
import styles from "./kpi-cards.module.css";

type Stat = (typeof stats)[number];

/** Rows in the patient dot matrix. */
const ROWS = 6;
/** The matrix ends on the current month and reaches back thirteen, so the same month a year ago sits at the start. */
const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
/** Clinic day shown in the ribbon: one bar per hour from 08:00, with the clock currently in the 10am hour. */
const DAY_START = 8;
const NOW_CELL = 2;
/** Doctors on the rota (the figure is how many of them are on duty; the dial has one tick per doctor) and the revenue goal for the month. */
const ROTA = 16;
const REVENUE_GOAL = 20000;
/** Where each card leads. */
const HREF: Record<string, string> = { patients: "/patients", appointments: "/appointments", doctors: "/doctors", revenue: "/billing" };

const hourLabel = (hour: number) => `${hour % 12 || 12}${hour < 12 ? "am" : "pm"}`;

/** Patients: twelve months as columns of dots. The more dots lit, the busier the month; the latest column glows. */
function DotMatrix({ data, name }: { data: readonly number[]; name: string }) {
  const high = Math.max(...data);
  return (
    <div className={styles.matrix} role="img" aria-label={`${name}: ${data.join(", ")}`}>
      {data.map((value, column) => {
        const lit = Math.max(1, Math.round((value / high) * ROWS));
        return (
          <span
            key={column}
            className={styles.column}
            data-latest={column === data.length - 1 || undefined}
            data-tip={`${MONTHS[column]} · ${value} new`}
            style={{ "--n": column } as CSSProperties}
          >
            {Array.from({ length: ROWS }, (_, row) => (
              <i key={row} data-lit={row < lit || undefined} style={{ "--r": row } as CSSProperties} />
            ))}
          </span>
        );
      })}
    </div>
  );
}

/** Appointments: today's bookings per hour as bars. Hours already past are solid, the current hour pulses, hours to come are hatched. */
function DayRibbon({ data, name }: { data: readonly number[]; name: string }) {
  const high = Math.max(...data);
  const seen = data.slice(0, NOW_CELL).reduce((sum, value) => sum + value, 0);
  const total = data.reduce((sum, value) => sum + value, 0);
  const last = data.length - 1;
  return (
    <div className={styles.ribbon}>
      <ol className={styles.cells} role="img" aria-label={`${name} by hour: ${data.join(", ")}`} style={{ "--count": data.length } as CSSProperties}>
        {data.map((value, index) => (
          <li
            key={index}
            data-state={index < NOW_CELL ? "past" : index === NOW_CELL ? "now" : "next"}
            data-tip={`${hourLabel(DAY_START + index)} · ${value} booked`}
            style={{ "--h": value / high, "--n": index } as CSSProperties}
          >
            {index === NOW_CELL && <b>Now</b>}
          </li>
        ))}
      </ol>
      <p className={styles.axis}>
        <span aria-hidden>{hourLabel(DAY_START)}</span>
        <span className={styles.progress}>{seen} seen · {total - seen} to go</span>
        <span aria-hidden>{hourLabel(DAY_START + last)}</span>
      </p>
    </div>
  );
}

/** Doctors: a fan with one tick per doctor on the rota. Lit ticks are on duty. The arc itself is laid out in CSS, so it
    stays a true circle at any card width. */
function DutyDial({ onDuty }: { onDuty: number }) {
  return (
    <div className={styles.dial}>
      <div className={styles.fan} aria-hidden style={{ "--count": ROTA } as CSSProperties}>
        {Array.from({ length: ROTA }, (_, index) => (
          <i key={index} data-lit={index < onDuty || undefined} style={{ "--n": index } as CSSProperties} />
        ))}
      </div>
      <p className={styles.dialRead}>
        <b>{Math.round((onDuty / ROTA) * 100)}%</b>
        <span>of the rota on duty</span>
      </p>
    </div>
  );
}

const dollars = (amount: number) => `$${Math.round(amount).toLocaleString("en-US")}`;

/** Revenue: progress to the monthly goal, with a marker where the month stands and a tick where last month finished. */
function GoalTrack({ amount, previous }: { amount: number; previous: number }) {
  const share = Math.min(1, amount / REVENUE_GOAL);
  const lastMonth = MONTHS[MONTHS.length - 2];
  return (
    <div className={styles.goal} style={{ "--p": share, "--prev": Math.min(1, previous / REVENUE_GOAL) } as CSSProperties}>
      <div
        className={styles.track}
        data-tip={`${dollars(amount)} of ${dollars(REVENUE_GOAL)} · ${lastMonth} ${dollars(previous)}`}
        role="img"
        aria-label={`${Math.round(share * 100)}% of the ${dollars(REVENUE_GOAL)} goal. ${lastMonth} finished at ${dollars(previous)}.`}
      >
        <span className={styles.fill} />
        <i className={styles.prev} />
        <span className={styles.marker}><b>{Math.round(share * 100)}%</b></span>
      </div>
      <p className={styles.goalNote}>
        <span>{dollars(REVENUE_GOAL - amount)} to go</span>
        <span className={styles.prevKey}>{lastMonth} ${(previous / 1000).toFixed(1)}k</span>
        <span>Goal ${REVENUE_GOAL / 1000}k</span>
      </p>
    </div>
  );
}

function visual({ id, label, value, change, trend }: Stat): ReactNode {
  const amount = Number(value.replace(/[^\d.]/g, ""));
  switch (id) {
    case "patients": return <DotMatrix data={trend} name={label} />;
    case "appointments": return <DayRibbon data={trend} name={label} />;
    case "doctors": return <DutyDial onDuty={amount} />;
    // Last month is backed out of this month's figure and its change, so the tick always agrees with the chip.
    default: return <GoalTrack amount={amount} previous={amount / (1 + parseFloat(change) / 100)} />;
  }
}

/** The four dashboard KPIs. Each figure gets its own picture instead of a shared line chart, and each card opens its page. */
export function KpiCards() {
  return (
    <div className={styles.grid}>
      {stats.map((stat, index) => {
        const { id, label, value, change, period, icon: Icon, tone } = stat;
        return (
          <Card key={id} className={styles.kpi} data-tone={tone} data-kpi={id} style={{ "--i": index } as CSSProperties}>
            <div className={styles.top}>
              {/* The link's ::after covers the card, so the whole card is one click target. */}
              <Link href={HREF[id]} className={`${styles.link} text-label`}>
                {label}
                <LuArrowUpRight className={styles.arrow} aria-hidden />
              </Link>
              <span className={styles.tile}><ToneTile tone={tone} size={30}><Icon /></ToneTile></span>
            </div>
            <div className={styles.figureRow}>
              <p className={styles.figure} data-tip={period}><CountUp value={value} /></p>
              <Delta value={change} variant="chip" />
            </div>
            <div className={styles.visual}>{visual(stat)}</div>
          </Card>
        );
      })}
    </div>
  );
}
