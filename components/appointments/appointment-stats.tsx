import { Card } from "@/components/ui/card";
import { Delta } from "@/components/ui/delta";
import { StatGrid } from "@/components/ui/stat-tile";
import { CountUp } from "@/components/ui/count-up";
import { monthDays, stages, stats, TODAY, type Stage } from "./data";
import styles from "./appointments.module.css";
import { DayStrip, type StripDay } from "./day-strip";

/** Which stages a ticket's strip draws. The total ticket stacks all three. */
const stagesFor = (id: string): readonly Stage[] =>
  id === "upcoming" ? ["Upcoming"] : id === "completed" ? ["Completed"] : id === "cancelled" ? ["Cancelled"] : stages;

const dayLabel = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });

/** The four figures as tickets: figure on top, a strip with one bar per weekday of the month, and a torn-off stub with the change. */
export function AppointmentStats() {
  const monthTotal = stats.find(({ id }) => id === "total")?.value ?? 0;

  return (
    <StatGrid>
      {stats.map(({ id, label, value, change, period, icon: Icon, tone, deltaTone }) => {
        const shown = stagesFor(id);
        const sums = monthDays.map((day) => shown.reduce((sum, stage) => sum + day[stage], 0));
        const peak = Math.max(1, ...sums);
        const days: StripDay[] = monthDays.map((day, index) => ({
          date: day.date,
          label: dayLabel.format(new Date(`${day.date}T00:00:00Z`)),
          today: day.date === TODAY,
          height: sums[index] / peak,
          parts: shown.map((stage) => ({ stage, count: day[stage] })),
        }));
        const share = id === "total" || !monthTotal ? null : Math.round((value / monthTotal) * 100);

        return (
          <Card key={id} className={styles.ticket} data-tone={tone}>
            <header className={styles.ticketTop}>
              <span className={styles.ticketLabel}>
                <Icon aria-hidden />
                <span className="text-label">{label}</span>
              </span>
              {share !== null && <span className={styles.ticketShare}>{share}% of month</span>}
            </header>
            <p className={styles.ticketFigure}>
              <CountUp value={String(value)} />
            </p>
            <DayStrip days={days} label={`${label} by day`} />
            <footer className={styles.ticketStub}>
              <Delta value={change} tone={deltaTone} variant="chip" />
              <span className="text-small text-muted">{period}</span>
            </footer>
          </Card>
        );
      })}
    </StatGrid>
  );
}
