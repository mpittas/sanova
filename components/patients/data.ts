import { LuHeart, LuUserCheck, LuUserPlus, LuUsers } from "react-icons/lu";
import { TODAY } from "@/components/appointments/data";
import type { ISODate } from "@/components/appointments/dates";
import type { StatTileProps } from "@/components/ui/stat-tile";
import { portraitUrl } from "@/lib/portraits";

export type PatientStatus = "Active" | "Inactive" | "At Risk";

export type Patient = {
  id: string;
  name: string;
  mrn: string;
  dob: ISODate;
  phone: string;
  email: string;
  lastVisit: ISODate;
  next: { date: ISODate; time: string } | null;
  status: PatientStatus;
  /** Registered in the last month. */
  isNew: boolean;
  provider: string;
  photo: string;
};

export const providers = ["Dr. James Carter", "Dr. Sarah Chen", "Dr. Michael Brown", "Dr. Priya Shah"] as const;

/** Whole years between a birth date and `TODAY`. */
export function ageOn(dob: ISODate, on: ISODate = TODAY) {
  const [by, bm, bd] = dob.split("-").map(Number);
  const [ty, tm, td] = on.split("-").map(Number);
  return ty - by - (tm < bm || (tm === bm && td < bd) ? 1 : 0);
}

// ---------------------------------------------------------------------------------------------
// Sample data. The first six rows are hand-written; the rest are generated deterministically so
// the totals shown in the stat tiles (248 / 215 / 18 / 7) are real counts, not made-up numbers.
// ---------------------------------------------------------------------------------------------

const featured: Omit<Patient, "isNew">[] = [
  { id: "p1", name: "Emily Carter", mrn: "CC-1001", dob: "1985-03-14", phone: "(555) 123-4567", email: "emily.carter@example.com", lastVisit: "2024-04-12", next: { date: "2024-05-10", time: "10:00" }, status: "Active", provider: providers[1], photo: portraitUrl("women", 44) },
  { id: "p2", name: "James Miller", mrn: "CC-1002", dob: "1990-07-22", phone: "(555) 987-6543", email: "james.miller@example.com", lastVisit: "2024-03-28", next: { date: "2024-05-15", time: "14:30" }, status: "Active", provider: providers[0], photo: portraitUrl("men", 32) },
  { id: "p3", name: "Sophia Nguyen", mrn: "CC-1003", dob: "1978-11-05", phone: "(555) 456-7890", email: "sophia.nguyen@example.com", lastVisit: "2024-04-03", next: null, status: "Inactive", provider: providers[2], photo: portraitUrl("women", 68) },
  { id: "p4", name: "Daniel Lee", mrn: "CC-1004", dob: "1992-01-17", phone: "(555) 234-5678", email: "daniel.lee@example.com", lastVisit: "2024-04-20", next: { date: "2024-05-08", time: "11:00" }, status: "Active", provider: providers[0], photo: portraitUrl("men", 45) },
  { id: "p5", name: "Robert Kim", mrn: "CC-1005", dob: "1965-05-30", phone: "(555) 876-5432", email: "robert.kim@example.com", lastVisit: "2024-03-12", next: null, status: "At Risk", provider: providers[3], photo: portraitUrl("men", 75) },
  { id: "p6", name: "Olivia Torres", mrn: "CC-1006", dob: "1998-09-09", phone: "(555) 345-6789", email: "olivia.torres@example.com", lastVisit: "2024-04-18", next: { date: "2024-05-20", time: "09:00" }, status: "Active", provider: providers[1], photo: portraitUrl("women", 65) },
];

const womenFirst = ["Amelia", "Charlotte", "Harper", "Evelyn", "Abigail", "Ella", "Scarlett", "Grace", "Chloe", "Victoria", "Riley", "Aria", "Lily", "Zoe", "Nora", "Hannah", "Layla", "Stella", "Maya", "Ivy", "Leah", "Nina", "Elena", "Julia", "Clara", "Sara", "Hazel", "Naomi", "Alice", "Ruby"];
const menFirst = ["Oliver", "Elijah", "William", "Lucas", "Benjamin", "Henry", "Alexander", "Jack", "Mason", "Ethan", "Logan", "Jacob", "Michael", "Leo", "Owen", "Caleb", "Isaac", "Ryan", "Nathan", "Adam", "Julian", "Samuel", "Dylan", "Aaron", "Miles", "Victor", "Hugo", "Felix", "Omar", "Theo"];
const lastNames = ["Anderson", "Bennett", "Campbell", "Davis", "Edwards", "Foster", "Garcia", "Harris", "Ibrahim", "Jensen", "Kowalski", "Lopez", "Morgan", "Nelson", "O'Brien", "Parker", "Quinn", "Reyes", "Sullivan", "Turner", "Underwood", "Vega", "Walker", "Xu", "Yamamoto", "Zimmerman", "Fischer", "Rossi", "Murphy", "Santos", "Novak", "Okafor", "Singh", "Larsen", "Bailey", "Cohen", "Dubois", "Evans", "Grant", "Hughes"];
const slots = ["08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"];

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

const pad = (value: number) => String(value).padStart(2, "0");

function generate(): Patient[] {
  const random = mulberry32(2024);
  const pick = <T,>(items: readonly T[]) => items[Math.floor(random() * items.length)];
  const between = (min: number, max: number) => min + Math.floor(random() * (max - min + 1));
  const dayOffset = (base: ISODate, offset: number) => {
    const [year, month, day] = base.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day + offset)).toISOString().slice(0, 10);
  };

  const total = 248;
  const generatedCount = total - featured.length;

  // Featured rows already contain 4 Active, 1 Inactive and 1 At Risk; fill the rest so totals are 215 / 26 / 7.
  const statuses: PatientStatus[] = [
    ...Array<PatientStatus>(215 - 4).fill("Active"),
    ...Array<PatientStatus>(26 - 1).fill("Inactive"),
    ...Array<PatientStatus>(7 - 1).fill("At Risk"),
  ];
  for (let i = statuses.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [statuses[i], statuses[j]] = [statuses[j], statuses[i]];
  }

  const used = new Set(featured.map((patient) => patient.name));
  const portraitCount = { women: 0, men: 0 };
  let newLeft = 18;

  const generated: Patient[] = [];
  for (let index = 0; index < generatedCount; index++) {
    const gender = index % 2 === 0 ? "women" : "men";
    let name = "";
    do {
      name = `${pick(gender === "women" ? womenFirst : menFirst)} ${pick(lastNames)}`;
    } while (used.has(name));
    used.add(name);

    const [first, last] = name.split(" ");
    const status = statuses[index];
    const isNew = status === "Active" && newLeft > 0 && random() < 0.12;
    if (isNew) newLeft--;

    const hasNext = status === "Active" && random() < 0.65;
    portraitCount[gender]++;

    generated.push({
      id: `p${index + 7}`,
      name,
      mrn: `CC-${1007 + index}`,
      dob: `${between(1945, 2008)}-${pad(between(1, 12))}-${pad(between(1, 28))}`,
      phone: `(555) ${between(200, 989)}-${between(1000, 9999)}`,
      email: `${first}.${last}@example.com`.toLowerCase().replace(/'/g, ""),
      lastVisit: isNew ? dayOffset(TODAY, -between(1, 20)) : dayOffset(TODAY, -between(6, 190)),
      next: hasNext ? { date: dayOffset(TODAY, between(1, 75)), time: pick(slots) } : null,
      status,
      isNew,
      provider: pick(providers),
      // 7 is coprime with 100, so portraits don't repeat for the first 100 people of each gender.
      photo: portraitUrl(gender, (portraitCount[gender] * 7 + 3) % 100),
    });
  }

  // If the random pass didn't mark enough new patients, top up from the earliest active ones.
  for (const patient of generated) {
    if (newLeft === 0) break;
    if (patient.status === "Active" && !patient.isNew) {
      patient.isNew = true;
      patient.lastVisit = dayOffset(TODAY, -between(1, 20));
      newLeft--;
    }
  }

  return [...featured.map((patient) => ({ ...patient, isNew: false })), ...generated];
}

export const patients: Patient[] = generate();

const count = (predicate: (patient: Patient) => boolean) => patients.filter(predicate).length;

export const patientStats: (StatTileProps & { id: string })[] = [
  { id: "total", label: "Total Patients", value: patients.length, change: "12%", period: "from last month", icon: LuUsers, tone: "primary" },
  { id: "active", label: "Active Patients", value: count((p) => p.status === "Active"), change: "8%", period: "from last month", icon: LuUserCheck, tone: "violet" },
  { id: "new", label: "New Patients", value: count((p) => p.isNew), change: "50%", period: "from last month", icon: LuUserPlus, tone: "amber" },
  { id: "risk", label: "At Risk", value: count((p) => p.status === "At Risk"), change: "2", period: "from last month", icon: LuHeart, tone: "coral", deltaTone: "danger" },
];
