import type { IconType } from "react-icons";
import { LuBaby, LuBone, LuFlower2, LuHeartPulse, LuSparkles, LuStethoscope } from "react-icons/lu";
import { specialtyTone, type Specialty } from "@/components/doctors/data";
import type { Tone } from "@/components/ui/tone-tile";
import { portraitUrl } from "@/lib/portraits";

/** The clinic's departments are its specialties, so they share names and colours with the Doctors page. */
export type DepartmentName = Exclude<Specialty, "Neurology">;

export type Department = {
  name: DepartmentName;
  tone: Tone;
  icon: IconType;
  description: string;
  doctors: number;
  /** Patients currently in care. */
  patients: number;
  /** Patient satisfaction, in percent. */
  satisfaction: number;
  /** A few of the team, shown as a stack of faces. The rest are counted from `doctors`. */
  team: string[];
};

const woman = (id: number) => portraitUrl("women", id);
const man = (id: number) => portraitUrl("men", id);

export const departments: Department[] = [
  {
    name: "General Practice",
    tone: specialtyTone["General Practice"],
    icon: LuStethoscope,
    description: "Comprehensive primary care for all ages.",
    doctors: 14,
    patients: 420,
    satisfaction: 98,
    team: [woman(90), man(52), man(85)],
  },
  {
    name: "Cardiology",
    tone: specialtyTone.Cardiology,
    icon: LuHeartPulse,
    description: "Advanced heart care for a healthier tomorrow.",
    doctors: 6,
    patients: 310,
    satisfaction: 96,
    team: [man(41), man(11), woman(44)],
  },
  {
    name: "Dermatology",
    tone: specialtyTone.Dermatology,
    icon: LuSparkles,
    description: "Healthy skin for a brighter you.",
    doctors: 6,
    patients: 180,
    satisfaction: 94,
    team: [woman(57), woman(35), man(32)],
  },
  {
    name: "Pediatrics",
    tone: specialtyTone.Pediatrics,
    icon: LuBaby,
    description: "Specialized care for growing lives.",
    doctors: 5,
    patients: 260,
    satisfaction: 97,
    team: [woman(71), man(7), woman(26)],
  },
  {
    name: "Orthopedics",
    tone: specialtyTone.Orthopedics,
    icon: LuBone,
    description: "Restoring mobility, improving lives.",
    doctors: 4,
    patients: 150,
    satisfaction: 95,
    team: [man(28), man(63), woman(12)],
  },
  {
    name: "Gynecology",
    tone: specialtyTone.Gynecology,
    icon: LuFlower2,
    description: "Compassionate care for every stage of life.",
    doctors: 4,
    patients: 100,
    satisfaction: 96,
    team: [woman(48), woman(68), man(22)],
  },
];

export const departmentByName = (name: DepartmentName) => departments.find((department) => department.name === name)!;

// ---------------------------------------------------------------------------------------------
// Clinic-wide figures: derived from the departments above, so they always match the cards.
// ---------------------------------------------------------------------------------------------

export function buildTotals(list: readonly Department[]) {
  const patients = list.reduce((sum, department) => sum + department.patients, 0);
  const weighted = list.reduce((sum, department) => sum + department.satisfaction * department.patients, 0);
  return {
    departments: list.length,
    doctors: list.reduce((sum, department) => sum + department.doctors, 0),
    appointments: patients,
    satisfaction: Math.round(weighted / (patients || 1)),
  };
}

// ---------------------------------------------------------------------------------------------
// Activity: appointments per month. The last point is the department's current monthly volume.
// ---------------------------------------------------------------------------------------------

export const activityMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] as const;

export const activityRanges = ["This Year", "Last Year"] as const;
export type ActivityRange = (typeof activityRanges)[number];

const thisYear: Record<DepartmentName, number[]> = {
  "General Practice": [300, 355, 310, 390, 375, 420],
  Cardiology: [360, 290, 340, 255, 287, 310],
  Dermatology: [120, 210, 150, 230, 170, 180],
  Pediatrics: [190, 140, 250, 170, 228, 260],
  Orthopedics: [230, 180, 120, 150, 143, 150],
  Gynecology: [60, 110, 85, 130, 92, 100],
};

/** Last year ran a little lower. */
const lastYearFactors = [0.88, 0.91, 0.87, 0.9, 0.89, 0.88];

export const activity: Record<ActivityRange, Record<DepartmentName, number[]>> = {
  "This Year": thisYear,
  "Last Year": Object.fromEntries(
    Object.entries(thisYear).map(([name, values]) => [name, values.map((value, index) => Math.round(value * lastYearFactors[index]))]),
  ) as Record<DepartmentName, number[]>,
};

/** Month-on-month change of the latest month, in whole percent. */
export const latestGrowth = (values: readonly number[]) => {
  const [previous, current] = values.slice(-2);
  return Math.round(((current - previous) / previous) * 100);
};

// ---------------------------------------------------------------------------------------------
// Recent updates
// ---------------------------------------------------------------------------------------------

export const updates: { id: string; department: DepartmentName; message: string; when: string }[] = [
  { id: "u1", department: "Cardiology", message: "Dr. Liam Carter joined the department", when: "2 days ago" },
  { id: "u2", department: "Pediatrics", message: "New consultation room added", when: "4 days ago" },
  { id: "u3", department: "Dermatology", message: "Department schedule updated", when: "1 week ago" },
];
