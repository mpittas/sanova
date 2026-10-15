import type { IconType } from "react-icons";
import { LuCalendar, LuCircleCheck, LuCircleX, LuClock } from "react-icons/lu";
import type { Tone } from "@/components/ui/tone-tile";
import { addDays, addMinutes, dayOfWeek, daysBetween, endOfMonth, startOfMonth, type ISODate } from "./dates";

/** The "current day" of the sample data set. */
export const TODAY: ISODate = "2024-05-09";
/** The "current time" on `TODAY`: earlier visits are done, the next one is being checked in. */
export const NOW = "11:20";

export type AppointmentStatus = "confirmed" | "checked-in" | "pending" | "unconfirmed" | "completed" | "cancelled";
export type VisitMode = "In Person" | "Telehealth";

export const statusMeta: Record<AppointmentStatus, { label: string; color: string }> = {
  confirmed: { label: "Confirmed", color: "var(--color-blue-500)" },
  "checked-in": { label: "Checked in", color: "var(--color-success-500)" },
  pending: { label: "Pending", color: "var(--color-amber-500)" },
  unconfirmed: { label: "Not confirmed", color: "var(--color-neutral-300)" },
  completed: { label: "Completed", color: "var(--color-primary-600)" },
  cancelled: { label: "Cancelled", color: "var(--color-coral-500)" },
};

/** The three buckets the schedule can be filtered by. Everything that isn't done or cancelled is still ahead of us. */
export const stages = ["Upcoming", "Completed", "Cancelled"] as const;
export type Stage = (typeof stages)[number];

export function stageOf(status: AppointmentStatus): Stage {
  if (status === "completed") return "Completed";
  if (status === "cancelled") return "Cancelled";
  return "Upcoming";
}

export type Appointment = {
  id: string;
  date: ISODate;
  /** 24h "HH:mm" */
  start: string;
  /** Minutes */
  duration: number;
  patient: string;
  mrn: string;
  title: string;
  summary: string;
  mode: VisitMode;
  status: AppointmentStatus;
  notes: string;
};

// ---------------------------------------------------------------------------------------------
// Sample data. Today's list is hand-written; the other days are generated deterministically from
// a visit-type catalogue, so the schedule has realistic rhythm (varied lengths, a lunch break,
// busier past days, a thinner calendar further out) and the stat tiles are real counts.
// ---------------------------------------------------------------------------------------------

/** Everyone who can show up in a schedule: name and medical record number. */
export const patientDirectory = [
  ["Emily Carter", "CC-1001"], ["James Miller", "CC-1002"], ["Sophia Nguyen", "CC-1003"], ["Daniel Lee", "CC-1004"],
  ["Robert Kim", "CC-1005"], ["Olivia Torres", "CC-1006"], ["Ava Patel", "CC-1007"], ["Liam Brooks", "CC-1008"],
  ["Mia Wong", "CC-1009"], ["Noah Wilson", "CC-1010"], ["Isabella Rossi", "CC-1011"], ["Ethan Moore", "CC-1012"],
  ["Grace Hall", "CC-1013"], ["Lucas Young", "CC-1014"], ["Chloe Adams", "CC-1015"], ["Henry Scott", "CC-1016"],
  ["Amelia Foster", "CC-1017"], ["Benjamin Harris", "CC-1018"], ["Harper Nelson", "CC-1019"], ["Mason Parker", "CC-1020"],
  ["Zoe Campbell", "CC-1021"], ["Leo Bennett", "CC-1022"], ["Nora Edwards", "CC-1023"], ["Caleb Morgan", "CC-1024"],
] as const;

const patientByName = (name: string) => {
  const found = patientDirectory.find(([patient]) => patient === name);
  if (!found) throw new Error(`Unknown patient: ${name}`);
  return { patient: found[0], mrn: found[1] };
};

export type VisitType = {
  title: string;
  summary: string;
  duration: number;
  /** Chance (0-1) that the visit is held over video. */
  telehealth: number;
  /** How often this visit comes up relative to the others. */
  weight: number;
  notes: string;
};

export const visitTypes: VisitType[] = [
  { title: "Follow-up Visit", summary: "Review symptoms and progress", duration: 20, telehealth: 0.3, weight: 5, notes: "Review progress since the last visit." },
  { title: "Medication Review", summary: "Review current medications", duration: 20, telehealth: 0.4, weight: 3, notes: "Confirm dosage and ask about side effects." },
  { title: "Lab Results Review", summary: "Discuss recent lab work", duration: 20, telehealth: 0.5, weight: 3, notes: "Results are ready in the chart." },
  { title: "Annual Checkup", summary: "Routine physical examination", duration: 45, telehealth: 0, weight: 3, notes: "Annual physical. Update the vaccination record." },
  { title: "Blood Pressure Check", summary: "Blood pressure monitoring", duration: 15, telehealth: 0, weight: 2, notes: "Patient to bring their home readings." },
  { title: "Vaccination", summary: "Routine immunisation", duration: 15, telehealth: 0, weight: 2, notes: "Check allergies before the injection." },
  { title: "Prescription Refill", summary: "Quarterly refill check", duration: 15, telehealth: 0.8, weight: 2, notes: "Renew prescription if vitals are stable." },
  { title: "Diabetes Management", summary: "HbA1c and glucose log review", duration: 30, telehealth: 0.3, weight: 2, notes: "Bring the glucose log and meter." },
  { title: "Cardiology Follow-up", summary: "ECG results review", duration: 30, telehealth: 0, weight: 1, notes: "Bring the current medication list." },
  { title: "Dermatology Consultation", summary: "Skin concern evaluation", duration: 30, telehealth: 0.2, weight: 1, notes: "Photos were uploaded to the chart." },
  { title: "Post-Surgery Check", summary: "Recovery and wound check", duration: 30, telehealth: 0.3, weight: 1, notes: "Check healing and mobility." },
  { title: "Mental Health Check-in", summary: "Wellbeing and treatment review", duration: 45, telehealth: 0.7, weight: 1, notes: "Allow extra time. No interruptions." },
  { title: "New Patient Consultation", summary: "Initial assessment and medical history review", duration: 60, telehealth: 0, weight: 1, notes: "First-time visit. Intake forms to be completed beforehand." },
];

/** Small seeded PRNG so the sample data is identical on server and client. */
function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const typeByTitle = (title: string) => {
  const found = visitTypes.find((type) => type.title === title);
  if (!found) throw new Error(`Unknown visit type: ${title}`);
  return found;
};

function visit(
  id: string,
  date: ISODate,
  start: string,
  patientName: string,
  title: string,
  mode: VisitMode,
  status: AppointmentStatus,
  notes?: string,
): Appointment {
  const type = typeByTitle(title);
  return { id, date, start, duration: type.duration, ...patientByName(patientName), title, summary: type.summary, mode, status, notes: notes ?? type.notes };
}

/** Today, written out by hand: three done, one cancelled, one patient at the desk, six still to come. */
const today: Appointment[] = [
  visit("a1", TODAY, "08:30", "Emily Carter", "Annual Checkup", "In Person", "completed", "Completed. Bloodwork ordered, no follow-up needed."),
  visit("a2", TODAY, "09:30", "James Miller", "Lab Results Review", "Telehealth", "completed", "Completed. Cholesterol slightly high, diet advice shared."),
  visit("a3", TODAY, "10:00", "Sophia Nguyen", "Diabetes Management", "In Person", "completed", "Completed. HbA1c improved to 6.8%."),
  visit("a4", TODAY, "10:45", "Daniel Lee", "Medication Review", "In Person", "cancelled", "Cancelled by the patient this morning. Offer a slot next week."),
  visit("a5", TODAY, "11:15", "Robert Kim", "Blood Pressure Check", "In Person", "checked-in", "Arrived at the front desk. Waiting to be called."),
  visit("a11", TODAY, "11:40", "Ethan Moore", "Follow-up Visit", "Telehealth", "confirmed", "Post-surgery recovery check by video. Link sent this morning."),
  visit("a6", TODAY, "13:30", "Olivia Torres", "New Patient Consultation", "In Person", "confirmed"),
  visit("a7", TODAY, "14:45", "Ava Patel", "Follow-up Visit", "Telehealth", "confirmed", "Treatment plan adjustments to review together. Video link sent."),
  visit("a8", TODAY, "15:30", "Liam Brooks", "Vaccination", "In Person", "pending", "Waiting on the insurer to confirm coverage."),
  visit("a9", TODAY, "15:55", "Mia Wong", "Follow-up Visit", "In Person", "unconfirmed", "Symptoms were reported by phone on May 6. Awaiting confirmation."),
  visit("a10", TODAY, "16:30", "Noah Wilson", "Prescription Refill", "Telehealth", "confirmed"),
];

const CALENDAR_START: ISODate = "2024-05-01";
const CALENDAR_END: ISODate = "2024-05-31";
/** Public holiday: the clinic is closed. */
const closedDays: ReadonlySet<ISODate> = new Set(["2024-05-27"]);

function pickType(random: () => number) {
  const total = visitTypes.reduce((sum, type) => sum + type.weight, 0);
  let roll = random() * total;
  for (const type of visitTypes) {
    roll -= type.weight;
    if (roll < 0) return type;
  }
  return visitTypes[0];
}

function statusFor(random: () => number, daysFromToday: number): AppointmentStatus {
  const roll = random();
  if (daysFromToday < 0) return roll < 0.88 ? "completed" : "cancelled";
  if (roll < 0.06) return "cancelled";
  // The further out, the less likely a patient has replied to the reminder.
  const confirmed = daysFromToday <= 2 ? 0.8 : daysFromToday <= 7 ? 0.6 : 0.3;
  if (roll < 0.06 + confirmed * 0.94) return "confirmed";
  return random() < 0.45 ? "pending" : "unconfirmed";
}

function generateDay(date: ISODate, dayIndex: number): Appointment[] {
  const random = mulberry32(dayIndex * 7919 + 13);
  const daysFromToday = daysBetween(TODAY, date);
  const target = daysFromToday < 0 ? 5 + Math.floor(random() * 3) : Math.max(2, 6 - Math.floor(daysFromToday / 5) + Math.floor(random() * 2));

  const list: Appointment[] = [];
  let cursor = random() < 0.5 ? "08:30" : "09:00";
  for (let index = 0; index < target; index++) {
    const type = pickType(random);
    // Keep visits out of the 12:00-13:00 lunch hour.
    if (cursor >= "12:00" && cursor < "13:00") cursor = "13:00";
    if (addMinutes(cursor, type.duration) > "12:00" && cursor < "12:00") cursor = "13:00";
    if (addMinutes(cursor, type.duration) > "17:00") break;

    const [patient, mrn] = patientDirectory[Math.floor(random() * patientDirectory.length)];
    const mode: VisitMode = random() < type.telehealth ? "Telehealth" : "In Person";
    const status = statusFor(random, daysFromToday);
    const notes =
      status === "completed" ? "Completed. No follow-up needed." : status === "cancelled" ? "Cancelled by the patient. Offer to rebook." : type.notes;

    list.push({ id: `g${dayIndex}-${index}`, date, start: cursor, duration: type.duration, patient, mrn, title: type.title, summary: type.summary, mode, status, notes });

    // Leave a gap now and then so the day doesn't look machine-packed.
    const gap = random() < 0.35 ? 15 * (1 + Math.floor(random() * 3)) : 5 * Math.floor(random() * 2);
    cursor = addMinutes(cursor, type.duration + gap);
  }
  return list;
}

function generate(): Appointment[] {
  const list: Appointment[] = [];
  for (let date = CALENDAR_START, dayIndex = 0; date <= CALENDAR_END; date = addDays(date, 1), dayIndex++) {
    const weekday = dayOfWeek(date);
    if (weekday === 0 || weekday === 6 || closedDays.has(date)) continue;
    list.push(...(date === TODAY ? today : generateDay(date, dayIndex)));
  }
  return list;
}

export const appointments: Appointment[] = generate();

/** The first visit still to come today. Opens in the details panel. */
export const nextUp = appointments.find((item) => item.date === TODAY && stageOf(item.status) === "Upcoming");

/** Counts for the month of `TODAY`, straight from the schedule above. */
const month = appointments.filter((item) => item.date >= startOfMonth(TODAY) && item.date <= endOfMonth(TODAY));
const countStage = (stage: Stage) => month.filter((item) => stageOf(item.status) === stage).length;

export const stats: {
  id: string;
  label: string;
  value: number;
  change: string;
  period: string;
  icon: IconType;
  tone: Tone;
  /** Cancelled going up is bad news, so it uses the alert colour. */
  deltaTone: "success" | "danger";
  /** Highlights the tile as the most important figure on the page. */
  featured?: boolean;
}[] = [
  { id: "upcoming", label: "Upcoming", value: countStage("Upcoming"), change: "8%", period: "from last week", icon: LuClock, tone: "amber", deltaTone: "success", featured: true },
  { id: "total", label: "Total Appointments", value: month.length, change: "12%", period: "from last month", icon: LuCalendar, tone: "blue", deltaTone: "success" },
  { id: "completed", label: "Completed", value: countStage("Completed"), change: "20%", period: "from last month", icon: LuCircleCheck, tone: "success", deltaTone: "success" },
  { id: "cancelled", label: "Cancelled", value: countStage("Cancelled"), change: "50%", period: "from last month", icon: LuCircleX, tone: "coral", deltaTone: "danger" },
];
