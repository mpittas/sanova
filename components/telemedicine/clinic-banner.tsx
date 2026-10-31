import { LuVideo } from "react-icons/lu";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { isStartingSoon, type Session, type SessionTab } from "./data";
import { SessionActions, statusChip, type SessionHandlers } from "./session-row";
import styles from "./clinic-banner.module.css";

type Props = {
  counts: Record<SessionTab, number>;
  /** The session that is live now, or the next one to start. */
  next?: Session;
  handlers: SessionHandlers;
  onSelectTab: (tab: SessionTab) => void;
};

/**
 * Banner under the page title, a quiet white card like the doctors and patient banners: the virtual clinic's three counts
 * (each one opens its list) and the session to start next.
 */
export function ClinicBanner({ counts, next, handlers, onSelectTab }: Props) {
  const stats: { tab: SessionTab; label: string; value: number; hot?: boolean }[] = [
    { tab: "Upcoming", label: "Upcoming", value: counts.Upcoming },
    { tab: "Instant Consult", label: "Waiting now", value: counts["Instant Consult"], hot: counts["Instant Consult"] > 0 },
    { tab: "Requested", label: "Requests", value: counts.Requested, hot: counts.Requested > 0 },
  ];
  const chip = next ? statusChip(next) : undefined;

  return (
    <section className={styles.banner} aria-label="Virtual care summary">
      <div className={styles.title}>
        <span className={styles.icon}>
          <LuVideo aria-hidden />
        </span>
        <div>
          <h2>Your virtual clinic</h2>
          <p>Care, wherever your patients are.</p>
        </div>
      </div>

      <ul className={styles.stats}>
        {stats.map(({ tab, label, value, hot }) => (
          <li key={tab}>
            <button type="button" onClick={() => onSelectTab(tab)} data-hot={hot || undefined} aria-label={`${label}: ${value}. Show list`}>
              <b>{value}</b>
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>

      {next && chip && (
        <div className={styles.next}>
          <Avatar name={next.patient} size={40} online={next.status === "in-progress"} />
          <div className={styles.nextText}>
            <span className={styles.nextLabel}>{next.status === "in-progress" ? "In progress" : "Up next"}</span>
            <strong>{next.patient}</strong>
            <span className={styles.nextVisit}>{next.title}</span>
          </div>
          <div className={styles.nextAction}>
            <Chip tone={chip.tone} variant="tag" size="sm">{chip.label}</Chip>
            <SessionActions session={next} handlers={handlers} size="sm" />
            {next.status === "scheduled" && !isStartingSoon(next) && (
              <Button variant="secondary" size="sm" onClick={() => handlers.onOpen(next.id)} aria-label={`View details: ${next.patient}`}>
                View Details
              </Button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
