import type { IconType } from "react-icons";
import { LuFlaskConical, LuHeartPulse, LuPill, LuRepeat, LuStethoscope, LuUserPlus } from "react-icons/lu";
import { appointments, NOW, patientDirectory, stageOf, TODAY, visitTypes, type Appointment } from "@/components/appointments/data";
import { addDays, addMinutes, dayOfWeek, daysBetween, formatDate, formatTime, type ISODate } from "@/components/appointments/dates";

export const tabs = ["Upcoming", "Past Sessions", "Instant Consult", "Requested"] as const;
export type SessionTab = (typeof tabs)[number];

export type CallType = "Video Call" | "Audio Call";

export type SessionStatus = "scheduled" | "in-progress" | "completed" | "cancelled" | "waiting" | "requested";

export type Session = {
  id: string;
  tab: SessionTab;
  status: SessionStatus;
  patient: string;
  mrn: string;
  /** Visit type, e.g. "Follow-up Visit". */
  title: string;
  /** One line on what the visit is about. */
  summary: string;
  callType: CallType;
  date: ISODate;
  /** 24h "HH:mm". For a request this is the time the patient asked for. */
  start: string;
  /** Minutes */
  duration: number;
  notes: string;
  /** Instant consults: how long the patient has been in the virtual waiting room. */
  waitingMinutes?: number;
  /** Requests: how long ago it came in, e.g. "2 hours ago". */
  requestedAgo?: string;
};

const mrnOf = (name: string) => {
  const found = patientDirectory.find(([patient]) => patient === name);
  if (!found) throw new Error(`Unknown patient: ${name}`);
  return found[1];
};

/** Refills are usually a quick phone call; everything else is on video. */
const callTypeFor = (title: string): CallType => (title === "Prescription Refill" ? "Audio Call" : "Video Call");

// ---------------------------------------------------------------------------------------------
// Scheduled and past sessions come straight from the appointments page (every telehealth visit),
// so the two pages always agree. Instant consults and requests only exist here.
// ---------------------------------------------------------------------------------------------

function fromAppointment(item: Appointment): Session {
  const stage = stageOf(item.status);
  return {
    id: `s-${item.id}`,
    tab: stage === "Upcoming" ? "Upcoming" : "Past Sessions",
    status: stage === "Upcoming" ? "scheduled" : stage === "Completed" ? "completed" : "cancelled",
    patient: item.patient,
    mrn: item.mrn,
    title: item.title,
    summary: item.summary,
    callType: callTypeFor(item.title),
    date: item.date,
    start: item.start,
    duration: item.duration,
    notes: item.notes,
  };
}

/** First 15-minute slot on `date`, at or after `preferred`, that is free in the schedule and outside the lunch hour. `undefined` when the rest of the day is full. */
export function firstFreeSlot(date: ISODate, preferred: string, duration: number, taken: readonly { date: ISODate; start: string; duration: number }[] = appointments.filter((item) => item.status !== "cancelled")) {
  const day = taken.filter((item) => item.date === date);
  let start = preferred;
  while (addMinutes(start, duration) <= "17:00") {
    const end = addMinutes(start, duration);
    const clashes = day.some((item) => start < addMinutes(item.start, item.duration) && end > item.start);
    const atLunch = start < "13:00" && end > "12:00";
    if (!clashes && !atLunch) return start;
    start = addMinutes(start, 15);
  }
  return undefined;
}

function request(id: string, patient: string, title: string, summary: string, date: ISODate, preferred: string, requestedAgo: string, notes: string): Session {
  const type = visitTypes.find((visit) => visit.title === title);
  const duration = type?.duration ?? 20;
  return {
    id,
    tab: "Requested",
    status: "requested",
    patient,
    mrn: mrnOf(patient),
    title,
    summary,
    callType: callTypeFor(title),
    date,
    start: firstFreeSlot(date, preferred, duration) ?? firstFreeSlot(date, "08:30", duration) ?? preferred,
    duration,
    notes,
    requestedAgo,
  };
}

const instant: Session[] = [
  {
    id: "i1",
    tab: "Instant Consult",
    status: "waiting",
    patient: "Chloe Adams",
    mrn: mrnOf("Chloe Adams"),
    title: "Instant Consult",
    summary: "Sore throat and a fever since last night",
    callType: "Video Call",
    date: TODAY,
    start: addMinutes(NOW, -4),
    duration: 15,
    notes: `Temperature 38.4 °C at home. No known allergies. Joined the waiting room at ${formatTime(addMinutes(NOW, -4))}.`,
    waitingMinutes: 4,
  },
  {
    id: "i2",
    tab: "Instant Consult",
    status: "waiting",
    patient: "Henry Scott",
    mrn: mrnOf("Henry Scott"),
    title: "Instant Consult",
    summary: "Migraine that hasn't eased with medication",
    callType: "Video Call",
    date: TODAY,
    start: addMinutes(NOW, -1),
    duration: 15,
    notes: `Third migraine this month. Taking sumatriptan as prescribed. Joined the waiting room at ${formatTime(addMinutes(NOW, -1))}.`,
    waitingMinutes: 1,
  },
];

const requests: Session[] = [
  request("r1", "Mia Wong", "Follow-up Visit", "Cough that has lasted two weeks", addDays(TODAY, 1), "14:00", "2 hours ago", "Dry cough, worse at night. No fever. Prefers a video visit because of work."),
  request("r2", "Lucas Young", "Prescription Refill", "Blood pressure medication runs out in 5 days", addDays(TODAY, 4), "09:30", "Yesterday", "Asked for a phone call. Last reading 128/82 on 6 May."),
];

export const initialSessions: Session[] = [
  ...appointments.filter((item) => item.mode === "Telehealth").map(fromAppointment),
  ...instant,
  ...requests,
];

// ---------------------------------------------------------------------------------------------
// Presentation helpers
// ---------------------------------------------------------------------------------------------

const minutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));

/** Minutes until a session on `TODAY` starts (negative once it is due). */
export const minutesUntil = (session: Session) => minutes(session.start) - minutes(NOW) + daysBetween(TODAY, session.date) * 1440;

export type Countdown = { label: string; tone: "success" | "info" | "neutral" };

/** "Starts in 25 min", "In 3 hours", "Tomorrow", "In 4 days". */
export function countdown(session: Session): Countdown {
  const until = minutesUntil(session);
  if (until <= 0) return { label: "Starting now", tone: "success" };
  if (until <= 60) return { label: `Starts in ${until} min`, tone: "success" };
  if (until < 1440 && session.date === TODAY) {
    const hours = Math.round(until / 60);
    return { label: `In ${hours} ${hours === 1 ? "hour" : "hours"}`, tone: "info" };
  }
  const days = daysBetween(TODAY, session.date);
  return { label: days === 1 ? "Tomorrow" : `In ${days} days`, tone: "neutral" };
}

/** A session that is about to begin gets the primary "Start Session" button. */
export const isStartingSoon = (session: Session) => session.status === "scheduled" && minutesUntil(session) <= 30;

/** "Today, 10:00 AM (30 min)", "Tomorrow, 2:00 PM (20 min)", "Fri, May 10, 9:30 AM (20 min)". */
export function whenLabel(session: Session) {
  const days = daysBetween(TODAY, session.date);
  const day =
    days === 0 ? "Today" : days === 1 ? "Tomorrow" : days === -1 ? "Yesterday" : formatDate(session.date, { weekday: "short", month: "short", day: "numeric" });
  return `${day}, ${formatTime(session.start)} (${session.duration} min)`;
}

export const reasonIcons: Record<string, IconType> = {
  "Follow-up Visit": LuRepeat,
  "Medication Review": LuPill,
  "Prescription Refill": LuPill,
  "Lab Results Review": LuFlaskConical,
  "New Patient Consultation": LuUserPlus,
  "Diabetes Management": LuHeartPulse,
  "Instant Consult": LuStethoscope,
};
export const fallbackIcon: IconType = LuStethoscope;

/** Monday of the week containing `iso`. */
export const startOfIsoWeek = (iso: ISODate) => addDays(iso, -((dayOfWeek(iso) + 6) % 7));

/** The visit types a telehealth session can be booked for (not those that need an in-person exam). */
export const bookableTitles = visitTypes.filter((type) => type.telehealth > 0).map((type) => type.title);
export const durationOf = (title: string) => visitTypes.find((type) => type.title === title)?.duration ?? 20;

export const patientNames = patientDirectory.map(([name]) => name);
export const mrnFor = mrnOf;
