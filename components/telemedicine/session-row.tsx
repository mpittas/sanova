import { LuCalendar, LuPhone, LuVideo } from "react-icons/lu";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Chip, type ChipTone } from "@/components/ui/chip";
import { countdown, isStartingSoon, whenLabel, type Session } from "./data";
import styles from "./telemedicine.module.css";

export type SessionHandlers = {
  onOpen: (id: string) => void;
  onStart: (id: string) => void;
  onEnd: (id: string) => void;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
};

/** The state of a session as a small label: how soon it starts, how it ended, how long someone has waited. */
export function statusChip(session: Session): { label: string; tone: ChipTone } {
  switch (session.status) {
    case "scheduled":
      return countdown(session);
    case "in-progress":
      return { label: "In progress", tone: "violet" };
    case "completed":
      return { label: "Completed", tone: "success" };
    case "cancelled":
      return { label: "Cancelled", tone: "danger" };
    case "waiting":
      return { label: `Waiting ${session.waitingMinutes ?? 0} min`, tone: "warning" };
    case "requested":
      return { label: `Requested ${session.requestedAgo ?? "recently"}`, tone: "neutral" };
  }
}

/** The buttons that fit a session's state. Shared by the list and the details dialog. */
export function SessionActions({ session, handlers, size = "md" }: { session: Session; handlers: SessionHandlers; size?: "sm" | "md" }) {
  const { id, patient, status } = session;

  switch (status) {
    case "waiting":
      return (
        <Button size={size} iconLeft={<LuVideo />} aria-label={`Join now: ${patient}`} onClick={() => handlers.onStart(id)}>
          Join Now
        </Button>
      );
    case "in-progress":
      return (
        <Button size={size} variant="danger" aria-label={`End session with ${patient}`} onClick={() => handlers.onEnd(id)}>
          End Session
        </Button>
      );
    case "requested":
      return (
        <>
          <Button size={size} variant="secondary" aria-label={`Decline request from ${patient}`} onClick={() => handlers.onDecline(id)}>
            Decline
          </Button>
          <Button size={size} aria-label={`Accept request from ${patient}`} onClick={() => handlers.onAccept(id)}>
            Accept
          </Button>
        </>
      );
    case "scheduled":
      return isStartingSoon(session) ? (
        <Button size={size} aria-label={`Start session with ${patient}`} onClick={() => handlers.onStart(id)}>
          Start Session
        </Button>
      ) : null;
    default:
      return null;
  }
}

export function SessionRow({ session, handlers }: { session: Session; handlers: SessionHandlers }) {
  const { id, patient, mrn, title, summary, callType, status } = session;
  const chip = statusChip(session);
  const CallIcon = callType === "Video Call" ? LuVideo : LuPhone;
  const live = status === "in-progress" || status === "waiting" || isStartingSoon(session);
  const showDetails = status === "completed" || status === "cancelled" || (status === "scheduled" && !isStartingSoon(session));

  return (
    <li className={styles.row} data-live={live || undefined}>
      <div className={styles.rowHead}>
      <Avatar name={patient} size={64} online={live} />
      <div className={styles.who}>
        <button type="button" className={styles.name} onClick={() => handlers.onOpen(id)}>
          {patient}
        </button>
        <p className={`text-small ${styles.visit}`}>{title}</p>
      </div>
        <Chip className={styles.status} tone={chip.tone} variant="tag" size="sm">
          {chip.label}
        </Chip>
      </div>
      <p className={styles.sessionSummary}>{summary}</p>
      <div className={styles.rowBottom}>
        <ul className={styles.facts} aria-label="Visit">
          <li><LuCalendar aria-hidden /><span>{whenLabel(session)}</span></li>
          <li><CallIcon aria-hidden /><span>{callType === "Video Call" ? "Video" : "Audio"}</span></li>
        </ul>
        <div className={styles.actions}>
          <SessionActions session={session} handlers={handlers} size="sm" />
          {showDetails && (
            <Button variant="secondary" size="sm" aria-label={`${status === "completed" ? "View summary" : "View details"}: ${patient}, ${mrn}`} onClick={() => handlers.onOpen(id)}>
              {status === "completed" ? "View Summary" : "View Details"}
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}
