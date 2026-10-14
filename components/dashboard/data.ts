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
    trend: [22, 30, 26, 38, 34, 44, 40, 52, 46, 58, 54, 66],
  },
  {
    id: "appointments",
    label: "Today's Appointments",
    value: "28",
    change: "8%",
    period: "vs last week",
    icon: LuCalendarCheck,
    tone: "blue",
    trend: [18, 20, 19, 24, 38, 22, 28, 40, 25, 30, 27, 34],
  },
  {
    id: "doctors",
    label: "Available Doctors",
    value: "14",
    change: "2%",
    period: "vs last month",
    icon: LuUserRound,
    tone: "violet",
    trend: [20, 26, 22, 30, 34, 28, 40, 36, 44, 38, 48, 46],
  },
  {
    id: "revenue",
    label: "Total Revenue",
    value: "$16,073",
    change: "9.3%",
    period: "vs last month",
    icon: LuFileText,
    tone: "coral",
    trend: [14, 18, 16, 22, 20, 26, 24, 32, 28, 36, 34, 44],
  },
];

export type AppointmentStatus = "Checked In" | "Upcoming" | "Rescheduled";

export const appointments: {
  time: string;
  period: "AM" | "PM";
  patient: string;
  type: string;
  status: AppointmentStatus;
}[] = [
  { time: "09:00", period: "AM", patient: "Olivia Bennett", type: "General Consultation", status: "Checked In" },
  { time: "09:30", period: "AM", patient: "Liam Carter", type: "Cardiology Follow-up", status: "Upcoming" },
  { time: "10:00", period: "AM", patient: "Ava Martinez", type: "Dermatology Consultation", status: "Upcoming" },
  { time: "10:30", period: "AM", patient: "Noah Wilson", type: "Annual Physical", status: "Rescheduled" },
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
  { categories: string[]; inPerson: number[]; telemedicine: number[]; max: number }
> = {
  Monthly: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    inPerson: [48, 54, 60, 59, 60, 55, 55, 59, 65, 70, 58, 55],
    telemedicine: [32, 35, 38, 38, 38, 36, 35, 40, 42, 41, 37, 36],
    max: 80,
  },
  Weekly: {
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    inPerson: [14, 18, 17, 20, 16, 8, 5],
    telemedicine: [9, 11, 12, 13, 10, 4, 3],
    max: 24,
  },
};

export const quickActions: { label: string; icon: IconType; tone: Tone }[] = [
  { label: "Add Patient", icon: LuUserPlus, tone: "primary" },
  { label: "Schedule Appointment", icon: LuCalendarPlus, tone: "blue" },
  { label: "View Medical Records", icon: LuFileText, tone: "violet" },
  { label: "Send Prescription", icon: LuPill, tone: "coral" },
];
