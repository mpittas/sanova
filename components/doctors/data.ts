import type { IconType } from "react-icons";
import { LuLayoutGrid, LuStar, LuStethoscope, LuUserCheck } from "react-icons/lu";
import { TODAY } from "@/components/appointments/data";
import { addDays, type ISODate } from "@/components/appointments/dates";
import type { Tone } from "@/components/ui/tone-tile";
import { portraitUrl } from "@/lib/portraits";

export const specialties = [
  "General Practice",
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Orthopedics",
  "Gynecology",
  "Neurology",
] as const;

export type Specialty = (typeof specialties)[number];
export type DoctorStatus = "Active" | "On Leave";

/** Each specialty has a colour: it tints the portrait on the card and the slice in the distribution chart. */
export const specialtyTone: Record<Specialty, Tone> = {
  "General Practice": "primary",
  Cardiology: "coral",
  Dermatology: "amber",
  Pediatrics: "blue",
  Orthopedics: "violet",
  Gynecology: "teal",
  Neurology: "success",
};

export type Doctor = {
  id: string;
  name: string;
  specialty: Specialty;
  /** Job title shown under the name, e.g. "Cardiologist". */
  title: string;
  patients: number;
  /** Years in practice. */
  experience: number;
  location: { site: string; floor: string };
  rating: number;
  reviews: number;
  status: DoctorStatus;
  /** Next free slot. For doctors on leave this is their first day back. */
  next: { date: ISODate; time: string };
  photo: string;
};

const tomorrow = addDays(TODAY, 1);

export const doctors: Doctor[] = [
  { id: "d1", name: "Dr. Olivia Bennett", specialty: "General Practice", title: "General Practitioner", patients: 420, experience: 8, location: { site: "Main Clinic", floor: "2nd Floor" }, rating: 4.9, reviews: 128, status: "Active", next: { date: TODAY, time: "13:30" }, photo: portraitUrl("women", 90) },
  { id: "d2", name: "Dr. Liam Carter", specialty: "Cardiology", title: "Cardiologist", patients: 310, experience: 10, location: { site: "Main Clinic", floor: "3rd Floor" }, rating: 4.8, reviews: 96, status: "Active", next: { date: TODAY, time: "15:00" }, photo: portraitUrl("men", 41) },
  { id: "d3", name: "Dr. Ava Martinez", specialty: "Dermatology", title: "Dermatologist", patients: 180, experience: 7, location: { site: "West Wing", floor: "1st Floor" }, rating: 4.8, reviews: 72, status: "Active", next: { date: tomorrow, time: "09:00" }, photo: portraitUrl("women", 57) },
  { id: "d4", name: "Dr. Noah Wilson", specialty: "General Practice", title: "Internist", patients: 260, experience: 12, location: { site: "Main Clinic", floor: "2nd Floor" }, rating: 4.7, reviews: 68, status: "Active", next: { date: TODAY, time: "11:00" }, photo: portraitUrl("men", 52) },
  { id: "d5", name: "Dr. Sophia Kim", specialty: "Pediatrics", title: "Pediatrician", patients: 190, experience: 9, location: { site: "East Wing", floor: "1st Floor" }, rating: 4.9, reviews: 84, status: "Active", next: { date: tomorrow, time: "10:00" }, photo: portraitUrl("women", 71) },
  { id: "d6", name: "Dr. Ethan Brooks", specialty: "Orthopedics", title: "Orthopedic Surgeon", patients: 150, experience: 14, location: { site: "East Wing", floor: "2nd Floor" }, rating: 4.6, reviews: 54, status: "On Leave", next: { date: "2024-05-15", time: "09:00" }, photo: portraitUrl("men", 28) },
  { id: "d7", name: "Dr. Mia Chen", specialty: "Gynecology", title: "Gynecologist", patients: 210, experience: 11, location: { site: "West Wing", floor: "2nd Floor" }, rating: 4.8, reviews: 77, status: "Active", next: { date: TODAY, time: "14:00" }, photo: portraitUrl("women", 48) },
  { id: "d8", name: "Dr. Lucas Patel", specialty: "Neurology", title: "Neurologist", patients: 130, experience: 6, location: { site: "Main Clinic", floor: "4th Floor" }, rating: 4.7, reviews: 62, status: "Active", next: { date: "2024-05-10", time: "13:00" }, photo: portraitUrl("men", 36) },
  { id: "d9", name: "Dr. James Carter", specialty: "General Practice", title: "General Practitioner", patients: 340, experience: 15, location: { site: "Main Clinic", floor: "1st Floor" }, rating: 4.8, reviews: 110, status: "Active", next: { date: TODAY, time: "16:00" }, photo: portraitUrl("men", 85) },
  { id: "d10", name: "Dr. Sarah Chen", specialty: "General Practice", title: "Family Physician", patients: 295, experience: 9, location: { site: "East Wing", floor: "1st Floor" }, rating: 4.7, reviews: 91, status: "Active", next: { date: tomorrow, time: "08:30" }, photo: portraitUrl("women", 8) },
  { id: "d11", name: "Dr. Michael Brown", specialty: "Cardiology", title: "Cardiologist", patients: 275, experience: 13, location: { site: "Main Clinic", floor: "3rd Floor" }, rating: 4.7, reviews: 83, status: "Active", next: { date: "2024-05-10", time: "10:30" }, photo: portraitUrl("men", 11) },
  { id: "d12", name: "Dr. Priya Shah", specialty: "Dermatology", title: "Dermatologist", patients: 165, experience: 5, location: { site: "West Wing", floor: "1st Floor" }, rating: 4.9, reviews: 59, status: "Active", next: { date: tomorrow, time: "14:30" }, photo: portraitUrl("women", 35) },
  { id: "d13", name: "Dr. Daniel Okafor", specialty: "Pediatrics", title: "Pediatrician", patients: 205, experience: 8, location: { site: "East Wing", floor: "1st Floor" }, rating: 4.8, reviews: 71, status: "On Leave", next: { date: "2024-05-20", time: "09:30" }, photo: portraitUrl("men", 7) },
  { id: "d14", name: "Dr. Marcus Reed", specialty: "Orthopedics", title: "Orthopedic Surgeon", patients: 170, experience: 10, location: { site: "East Wing", floor: "2nd Floor" }, rating: 4.6, reviews: 49, status: "Active", next: { date: "2024-05-10", time: "11:30" }, photo: portraitUrl("men", 63) },
];

export const doctorByName = (name: string) => doctors.find((doctor) => doctor.name === name);

// ---------------------------------------------------------------------------------------------
// Team overview: every figure is derived from the list above, so it always matches the cards.
// ---------------------------------------------------------------------------------------------

/** Overview tiles for a list of doctors. New doctors without reviews are left out of the average rating. */
export function buildOverview(list: readonly Doctor[]): { id: string; label: string; value: string; icon: IconType; tone: Tone }[] {
  const active = list.filter((doctor) => doctor.status === "Active").length;
  const rated = list.filter((doctor) => doctor.rating > 0);
  const average = rated.reduce((sum, doctor) => sum + doctor.rating, 0) / (rated.length || 1);

  return [
    { id: "total", label: "Total Doctors", value: String(list.length), icon: LuStethoscope, tone: "primary" },
    { id: "active", label: "Active Doctors", value: String(active), icon: LuUserCheck, tone: "violet" },
    { id: "specialties", label: "Specialties", value: String(specialties.length), icon: LuLayoutGrid, tone: "amber" },
    { id: "rating", label: "Average Rating", value: rated.length ? average.toFixed(1) : "–", icon: LuStar, tone: "blue" },
  ];
}

// ---------------------------------------------------------------------------------------------
// Today's doctor schedule
// ---------------------------------------------------------------------------------------------

export type ScheduleStatus = "Completed" | "In Progress" | "Upcoming";

export const todaySchedule: { id: string; time: string; doctor: string; visit: string; status: ScheduleStatus }[] = [
  { id: "s1", time: "09:00", doctor: "Dr. Olivia Bennett", visit: "General Consultation", status: "Completed" },
  { id: "s2", time: "10:30", doctor: "Dr. Noah Wilson", visit: "Annual Physical", status: "In Progress" },
  { id: "s3", time: "13:30", doctor: "Dr. Ava Martinez", visit: "Follow-up Visit", status: "Upcoming" },
  { id: "s4", time: "15:00", doctor: "Dr. Liam Carter", visit: "Cardiology Consultation", status: "Upcoming" },
];

// ---------------------------------------------------------------------------------------------
// Specialty distribution: the five biggest specialties, with the single-doctor ones grouped as "Others".
// ---------------------------------------------------------------------------------------------

const grouped: Specialty[] = ["Gynecology", "Neurology"];

export type DistributionSlice = { label: string; count: number; tone: Tone | "neutral" };

/** Slices for a list of doctors. Keeps a fixed order so colours never change when the list does. */
export function buildDistribution(list: readonly Doctor[]): DistributionSlice[] {
  const countOf = (specialty: Specialty) => list.filter((doctor) => doctor.specialty === specialty).length;
  return [
    ...specialties
      .filter((specialty) => !grouped.includes(specialty))
      .map((specialty) => ({ label: specialty, count: countOf(specialty), tone: specialtyTone[specialty] })),
    { label: "Others", count: grouped.reduce((sum, specialty) => sum + countOf(specialty), 0), tone: "neutral" as const },
  ];
}
