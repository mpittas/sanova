import type { IconType } from "react-icons";
import { LuCalendar, LuCircleCheck, LuCircleX, LuClock } from "react-icons/lu";
import type { Tone } from "@/components/ui/tone-tile";
import type { ISODate } from "./dates";

/** The "current day" of the sample data set. */
export const TODAY: ISODate = "2024-05-09";

export type AppointmentStatus = "confirmed" | "checked-in" | "pending" | "unconfirmed";
export type VisitMode = "In Person" | "Telehealth";

export const statusMeta: Record<AppointmentStatus, { label: string; color: string }> = {
  confirmed: { label: "Confirmed", color: "var(--color-primary-500)" },
  "checked-in": { label: "Checked in", color: "var(--color-success-500)" },
  pending: { label: "Pending", color: "var(--color-amber-500)" },
  unconfirmed: { label: "Not confirmed", color: "var(--color-neutral-300)" },
};

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

export const appointments: Appointment[] = [
  { id: "a1", date: "2024-05-09", start: "09:00", duration: 30, patient: "Emily Carter", mrn: "CC-1001", title: "Annual Checkup", summary: "Routine physical examination", mode: "In Person", status: "confirmed", notes: "Annual physical. Bring previous lab results." },
  { id: "a2", date: "2024-05-09", start: "09:30", duration: 30, patient: "James Miller", mrn: "CC-1002", title: "Follow-up Visit", summary: "Discuss test results", mode: "Telehealth", status: "checked-in", notes: "Video link sent. Review bloodwork from last week." },
  { id: "a3", date: "2024-05-09", start: "10:00", duration: 30, patient: "Sophia Nguyen", mrn: "CC-1003", title: "Lab Results Review", summary: "Discuss recent lab work", mode: "In Person", status: "confirmed", notes: "Cholesterol panel and HbA1c results are ready." },
  { id: "a4", date: "2024-05-09", start: "10:30", duration: 30, patient: "Daniel Lee", mrn: "CC-1004", title: "Medication Review", summary: "Review current medications", mode: "In Person", status: "pending", notes: "Patient reported mild side effects. Confirm dosage." },
  { id: "a5", date: "2024-05-09", start: "11:00", duration: 30, patient: "Robert Kim", mrn: "CC-1005", title: "Follow-up Visit", summary: "Blood pressure check", mode: "In Person", status: "unconfirmed", notes: "Awaiting confirmation from the patient." },
  { id: "a6", date: "2024-05-09", start: "13:30", duration: 30, patient: "Olivia Torres", mrn: "CC-1006", title: "New Patient Consultation", summary: "Initial assessment and medical history review.", mode: "In Person", status: "confirmed", notes: "First-time visit. Please have patient complete intake forms." },
  { id: "a7", date: "2024-05-09", start: "14:00", duration: 30, patient: "Ava Patel", mrn: "CC-1007", title: "Follow-up Visit", summary: "Discuss treatment plan", mode: "Telehealth", status: "checked-in", notes: "Treatment plan adjustments to review together." },
  { id: "a8", date: "2024-05-09", start: "15:00", duration: 30, patient: "Liam Brooks", mrn: "CC-1008", title: "Annual Checkup", summary: "Routine physical examination", mode: "In Person", status: "confirmed", notes: "Annual physical. Vaccination record to be updated." },
  { id: "a9", date: "2024-05-09", start: "16:00", duration: 30, patient: "Mia Wong", mrn: "CC-1009", title: "Follow-up Visit", summary: "Review symptoms", mode: "In Person", status: "unconfirmed", notes: "Symptoms reported over the phone on May 6." },

  { id: "b1", date: "2024-05-01", start: "10:00", duration: 30, patient: "Noah Wilson", mrn: "CC-1010", title: "Annual Physical", summary: "Routine physical examination", mode: "In Person", status: "checked-in", notes: "Completed. No follow-up needed." },
  { id: "b2", date: "2024-05-07", start: "09:00", duration: 45, patient: "Isabella Rossi", mrn: "CC-1011", title: "Dermatology Consultation", summary: "Skin rash evaluation", mode: "In Person", status: "confirmed", notes: "Photos of the rash were uploaded to the chart." },
  { id: "b3", date: "2024-05-07", start: "11:30", duration: 30, patient: "Ethan Moore", mrn: "CC-1012", title: "Follow-up Visit", summary: "Post-surgery recovery check", mode: "Telehealth", status: "confirmed", notes: "Check incision healing via video." },
  { id: "b4", date: "2024-05-13", start: "09:30", duration: 30, patient: "Grace Hall", mrn: "CC-1013", title: "Cardiology Follow-up", summary: "ECG results review", mode: "In Person", status: "confirmed", notes: "Bring medication list." },
  { id: "b5", date: "2024-05-13", start: "14:00", duration: 60, patient: "Lucas Young", mrn: "CC-1014", title: "New Patient Consultation", summary: "Initial assessment", mode: "In Person", status: "pending", notes: "Insurance verification still pending." },
  { id: "b6", date: "2024-05-15", start: "10:00", duration: 30, patient: "Chloe Adams", mrn: "CC-1015", title: "Vaccination", summary: "Seasonal vaccine", mode: "In Person", status: "confirmed", notes: "No known allergies." },
  { id: "b7", date: "2024-05-20", start: "13:00", duration: 30, patient: "Henry Scott", mrn: "CC-1016", title: "Medication Review", summary: "Quarterly refill check", mode: "Telehealth", status: "unconfirmed", notes: "Awaiting confirmation." },
];

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
}[] = [
  { id: "total", label: "Total Appointments", value: 42, change: "12%", period: "from last month", icon: LuCalendar, tone: "primary", deltaTone: "success" },
  { id: "completed", label: "Completed", value: 36, change: "20%", period: "from last month", icon: LuCircleCheck, tone: "success", deltaTone: "success" },
  { id: "upcoming", label: "Upcoming", value: 6, change: "8%", period: "from last week", icon: LuClock, tone: "amber", deltaTone: "success" },
  { id: "cancelled", label: "Cancelled", value: 3, change: "50%", period: "from last month", icon: LuCircleX, tone: "coral", deltaTone: "danger" },
];
