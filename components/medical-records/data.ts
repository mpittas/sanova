import type { IconType } from "react-icons";
import { LuFileImage, LuFileText, LuFlaskConical, LuImage, LuPill, LuStethoscope } from "react-icons/lu";
import { TODAY } from "@/components/appointments/data";
import { addMonths, type ISODate } from "@/components/appointments/dates";
import type { ChipTone } from "@/components/ui/chip";
import type { Tone } from "@/components/ui/tone-tile";

// ---------------------------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------------------------

export type RecordType = "Visit" | "Lab" | "Prescription" | "Imaging" | "Note";
export const recordTypes: readonly RecordType[] = ["Visit", "Lab", "Prescription", "Imaging", "Note"];

/** Each record type has an icon and a colour, used on the timeline tile, its dot and the type chip. */
export const recordMeta: Record<RecordType, { icon: IconType; tone: Tone; chip: ChipTone }> = {
  Visit: { icon: LuStethoscope, tone: "primary", chip: "success" },
  Lab: { icon: LuFlaskConical, tone: "blue", chip: "info" },
  Prescription: { icon: LuPill, tone: "coral", chip: "danger" },
  Imaging: { icon: LuImage, tone: "violet", chip: "violet" },
  Note: { icon: LuFileText, tone: "teal", chip: "neutral" },
};

export type MedicalRecord = {
  id: string;
  type: RecordType;
  title: string;
  /** Who or where, e.g. "Dr. James Carter" or "Imaging Department". */
  source: string;
  /** What it was about, e.g. "Routine checkup". Optional. */
  subtitle?: string;
  summary: string;
  date: ISODate;
  /** Extra facts shown when the record is opened. */
  details: { label: string; value: string }[];
};

export const seedRecords: MedicalRecord[] = [
  {
    id: "mr1",
    type: "Visit",
    title: "General Consultation",
    source: "Dr. James Carter",
    subtitle: "Routine checkup",
    summary: "Patient reports feeling well overall. No major concerns. Continued with current treatment plan.",
    date: "2024-05-13",
    details: [
      { label: "Blood pressure", value: "118/76 mmHg" },
      { label: "Heart rate", value: "72 bpm" },
      { label: "Weight", value: "61 kg" },
    ],
  },
  {
    id: "mr2",
    type: "Lab",
    title: "Lab Results",
    source: "Routine blood work",
    summary: "All values within normal range. No significant abnormalities detected.",
    date: "2024-04-02",
    details: [
      { label: "Hemoglobin", value: "13.6 g/dL" },
      { label: "Glucose", value: "92 mg/dL" },
      { label: "Cholesterol", value: "178 mg/dL" },
    ],
  },
  {
    id: "mr3",
    type: "Prescription",
    title: "Prescription Updated",
    source: "Dr. Sarah Kim",
    summary: "Albuterol inhaler prescribed for asthma management. Use as needed.",
    date: "2024-01-15",
    details: [
      { label: "Medication", value: "Albuterol 90 mcg" },
      { label: "Dose", value: "2 puffs as needed" },
      { label: "Refills", value: "2 remaining" },
    ],
  },
  {
    id: "mr4",
    type: "Imaging",
    title: "Chest X-ray",
    source: "Imaging Department",
    summary: "Chest X-ray completed. Normal results. No acute findings.",
    date: "2023-11-28",
    details: [
      { label: "Study", value: "Chest PA and lateral" },
      { label: "Findings", value: "Normal" },
      { label: "Radiologist", value: "Dr. Ana Ruiz" },
    ],
  },
  {
    id: "mr5",
    type: "Note",
    title: "Medical Note",
    source: "Dr. Michael Brown",
    summary: "Follow-up on asthma management. Patient reports improved symptoms.",
    date: "2023-08-10",
    details: [
      { label: "Condition", value: "Asthma" },
      { label: "Status", value: "Improving" },
      { label: "Next review", value: "In 3 months" },
    ],
  },
  {
    id: "mr6",
    type: "Visit",
    title: "Annual Physical",
    source: "Dr. James Carter",
    subtitle: "Preventive care",
    summary: "Comprehensive annual exam. Vaccinations up to date. Lifestyle guidance provided.",
    date: "2023-03-02",
    details: [
      { label: "Blood pressure", value: "120/78 mmHg" },
      { label: "Heart rate", value: "70 bpm" },
      { label: "Weight", value: "60 kg" },
    ],
  },
  {
    id: "mr7",
    type: "Lab",
    title: "Lipid Panel",
    source: "Routine blood work",
    summary: "Cholesterol slightly elevated. Diet review recommended before the next panel.",
    date: "2023-01-18",
    details: [
      { label: "LDL", value: "128 mg/dL" },
      { label: "HDL", value: "58 mg/dL" },
      { label: "Triglycerides", value: "110 mg/dL" },
    ],
  },
];

// ---------------------------------------------------------------------------------------------
// Tabs and time ranges
// ---------------------------------------------------------------------------------------------

export const tabs = ["Overview", "Medical History", "Visits", "Prescriptions", "Lab Results", "Imaging", "Documents"] as const;
export type RecordTab = (typeof tabs)[number];

/** Which record types each tab shows on the timeline. `Documents` has its own list. */
export const tabTypes: Record<Exclude<RecordTab, "Documents">, readonly RecordType[]> = {
  Overview: recordTypes,
  "Medical History": ["Visit", "Note"],
  Visits: ["Visit"],
  Prescriptions: ["Prescription"],
  "Lab Results": ["Lab"],
  Imaging: ["Imaging"],
};

export const tabDescriptions: Record<RecordTab, string> = {
  Overview: "A timeline of recent medical events and updates.",
  "Medical History": "Visits and clinical notes, newest first.",
  Visits: "Every consultation and checkup.",
  Prescriptions: "Medications prescribed and updated.",
  "Lab Results": "Blood work and other laboratory tests.",
  Imaging: "X-rays, scans and other imaging studies.",
  Documents: "Reports and files attached to this record.",
};

export const ranges = ["All Time", "Last 6 Months", "Last 12 Months"] as const;
export type Range = (typeof ranges)[number];

/** Earliest date a record can have to be inside `range`. */
export const rangeStart = (range: Range): ISODate =>
  range === "All Time" ? "0000-01-01" : addMonths(TODAY, range === "Last 6 Months" ? -6 : -12);

// ---------------------------------------------------------------------------------------------
// Key health information and documents
// ---------------------------------------------------------------------------------------------

export type PatientDocument = { id: string; name: string; date: ISODate; type: "PDF"; size: string; icon: IconType; tone: Tone };

export const documents: PatientDocument[] = [
  { id: "doc1", name: "Lab Results - Blood Work", date: "2024-05-13", type: "PDF", size: "245 KB", icon: LuFileText, tone: "coral" },
  { id: "doc2", name: "Chest X-ray Report", date: "2023-11-28", type: "PDF", size: "1.2 MB", icon: LuFileImage, tone: "blue" },
  { id: "doc3", name: "Prescription Record", date: "2024-04-02", type: "PDF", size: "180 KB", icon: LuFileText, tone: "success" },
  { id: "doc4", name: "Visit Summary", date: "2024-01-10", type: "PDF", size: "320 KB", icon: LuFileText, tone: "violet" },
  { id: "doc5", name: "Annual Physical Report", date: "2023-03-02", type: "PDF", size: "410 KB", icon: LuFileText, tone: "primary" },
  { id: "doc6", name: "Lipid Panel Results", date: "2023-01-18", type: "PDF", size: "152 KB", icon: LuFileText, tone: "teal" },
];

/** How many documents the side card shows. */
export const LATEST_DOCUMENTS = 4;
