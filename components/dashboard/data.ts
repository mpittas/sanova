import type { IconType } from "react-icons";
import {
  LuBaby,
  LuBone,
  LuCalendarCheck,
  LuCalendarPlus,
  LuFileText,
  LuHeartPulse,
  LuPill,
  LuSparkles,
  LuUserPlus,
  LuUserRound,
  LuUsers,
} from "react-icons/lu";
import type { Tone } from "@/components/ui/tone-tile";

export const doctor = {
  name: "Dr. James Carter",
  surname: "Carter",
  role: "General Practitioner",
};

/** Each KPI keeps its own colour: patients = brand green, appointments = blue (scheduled), doctors = violet (team), revenue = amber (money; coral would read as an alert). */
export const stats: {
  id: string;
  label: string;
  value: string;
  change: string;
  period: string;
  icon: IconType;
  tone: Tone;
  trend: number[];
}[] = [
  {
    id: "patients",
    label: "Total Patients",
    value: "1,248",
    change: "12%",
    period: "vs last month",
    icon: LuUsers,
    tone: "primary",
    trend: [38, 46, 54, 48, 38, 34, 44, 58, 64, 56, 52, 62],
  },
  {
    id: "appointments",
    label: "Today's Appointments",
    value: "28",
    change: "8%",
    period: "vs last week",
    icon: LuCalendarCheck,
    tone: "blue",
    trend: [44, 36, 28, 34, 46, 56, 50, 38, 30, 40, 54, 48],
  },
  {
    id: "doctors",
    label: "Available Doctors",
    value: "14",
    change: "2%",
    period: "vs last month",
    icon: LuUserRound,
    tone: "violet",
    trend: [30, 38, 46, 52, 44, 32, 28, 36, 48, 54, 46, 40],
  },
  {
    id: "revenue",
    label: "Total Revenue",
    value: "$16,073",
    change: "9.3%",
    period: "vs last month",
    icon: LuFileText,
    tone: "amber",
    trend: [26, 34, 30, 42, 56, 52, 40, 36, 46, 60, 66, 58],
  },
];

export type AppointmentStatus = "Checked In" | "Upcoming" | "Rescheduled";

export const appointmentTabs = ["All", "Checked In", "Upcoming", "Rescheduled"] as const;
export type AppointmentTab = (typeof appointmentTabs)[number];

export const appointments: {
  time: string;
  period: "AM" | "PM";
  patient: string;
  /** Medical record number shown under the name. */
  mrn: string;
  visit: string;
  department: string;
  /** Number of unread notes on the visit. */
  notes: number;
  fee: number;
  status: AppointmentStatus;
}[] = [
  { time: "09:00", period: "AM", patient: "Olivia Bennett", mrn: "MRN-20418", visit: "General Consultation", department: "General Practice", notes: 0, fee: 80, status: "Checked In" },
  { time: "09:30", period: "AM", patient: "Liam Carter", mrn: "MRN-20377", visit: "Cardiology Follow-up", department: "Cardiology", notes: 2, fee: 140, status: "Upcoming" },
  { time: "10:00", period: "AM", patient: "Ava Martinez", mrn: "MRN-20562", visit: "Dermatology Consultation", department: "Dermatology", notes: 0, fee: 110, status: "Upcoming" },
  { time: "10:30", period: "AM", patient: "Noah Wilson", mrn: "MRN-19984", visit: "Annual Physical", department: "General Practice", notes: 1, fee: 95, status: "Rescheduled" },
  { time: "11:00", period: "AM", patient: "Mia Wong", mrn: "MRN-20611", visit: "Child Wellness Check", department: "Pediatrics", notes: 0, fee: 70, status: "Checked In" },
  { time: "11:30", period: "AM", patient: "Lucas Young", mrn: "MRN-20290", visit: "Knee Assessment", department: "Orthopedics", notes: 0, fee: 125, status: "Upcoming" },
];

export const periods = ["This Year", "Last Year"] as const;
export type Period = (typeof periods)[number];

export const patientStatistics: Record<Period, { total: number; returning: number; newPatients: number; daily: number }> = {
  "This Year": { total: 1248, returning: 892, newPatients: 286, daily: 72 },
  "Last Year": { total: 1104, returning: 801, newPatients: 221, daily: 64 },
};

export const demographics: Record<Period, { total: number; groups: { label: string; share: number }[] }> = {
  "This Year": {
    total: 1248,
    groups: [
      { label: "Female", share: 52 },
      { label: "Male", share: 45 },
      { label: "Other", share: 3 },
    ],
  },
  "Last Year": {
    total: 1104,
    groups: [
      { label: "Female", share: 54 },
      { label: "Male", share: 43 },
      { label: "Other", share: 3 },
    ],
  },
};

export const departmentRanges = ["Weekly", "Monthly"] as const;
export type DepartmentRange = (typeof departmentRanges)[number];

export const departments: Record<
  DepartmentRange,
  { name: string; patients: number; share: number; icon: IconType; tone: Tone }[]
> = {
  Weekly: [
    { name: "General Practice", patients: 420, share: 40, icon: LuUsers, tone: "primary" },
    { name: "Cardiology", patients: 310, share: 25, icon: LuHeartPulse, tone: "coral" },
    { name: "Dermatology", patients: 180, share: 15, icon: LuSparkles, tone: "amber" },
    { name: "Pediatrics", patients: 130, share: 10, icon: LuBaby, tone: "blue" },
    { name: "Orthopedics", patients: 110, share: 10, icon: LuBone, tone: "violet" },
  ],
  Monthly: [
    { name: "General Practice", patients: 1480, share: 38, icon: LuUsers, tone: "primary" },
    { name: "Cardiology", patients: 1040, share: 24, icon: LuHeartPulse, tone: "coral" },
    { name: "Dermatology", patients: 700, share: 16, icon: LuSparkles, tone: "amber" },
    { name: "Pediatrics", patients: 520, share: 12, icon: LuBaby, tone: "blue" },
    { name: "Orthopedics", patients: 410, share: 10, icon: LuBone, tone: "violet" },
  ],
};

export const trendRanges = ["Monthly", "Weekly"] as const;
export type TrendRange = (typeof trendRanges)[number];

export const appointmentTrends: Record<
  TrendRange,
  { categories: string[]; inPerson: number[]; telemedicine: number[]; max: number; change: string }
> = {
  Monthly: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    inPerson: [48, 54, 60, 59, 60, 55, 55, 59, 65, 70, 58, 55],
    telemedicine: [32, 35, 38, 38, 38, 36, 35, 40, 42, 41, 37, 36],
    max: 80,
    change: "8.4%",
  },
  Weekly: {
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    inPerson: [14, 18, 17, 20, 16, 8, 5],
    telemedicine: [9, 11, 12, 13, 10, 4, 3],
    max: 24,
    change: "5.1%",
  },
};

export const quickActions: { label: string; icon: IconType; tone: Tone }[] = [
  { label: "Add Patient", icon: LuUserPlus, tone: "primary" },
  { label: "Schedule Appointment", icon: LuCalendarPlus, tone: "blue" },
  { label: "View Medical Records", icon: LuFileText, tone: "violet" },
  { label: "Send Prescription", icon: LuPill, tone: "coral" },
];

/** Appointments per day for the last full month (September 2026). Closed on Sundays; Saturdays and a few quiet weekdays have none, so the month has gaps. */
export const appointmentCalendar = (() => {
  const year = 2026;
  const month = 8;
  const perWeekday = [0, 11, 13, 12, 12, 10, 5];
  const values: Record<number, number> = {};
  for (let day = 1; day <= new Date(year, month + 1, 0).getDate(); day += 1) {
    const weekday = new Date(year, month, day).getDay();
    // Deterministic pseudo-random numbers so the month looks organic but renders the same on server and client.
    const random = (seed: number) => {
      const x = Math.sin(day * seed) * 43758.5453;
      return x - Math.floor(x);
    };
    const quiet = random(78.233) < (weekday === 6 ? 0.55 : 0.3);
    if (quiet) continue;
    values[day] = Math.max(1, Math.round(perWeekday[weekday] * (0.3 + 1.0 * random(12.9898))));
  }
  const total = Object.values(values).reduce((sum, value) => sum + value, 0);
  return { year, month, values, total, previousTotal: Math.round(total / 1.092) };
})();
