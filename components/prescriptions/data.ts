import type { IconType } from "react-icons";
import { LuPill, LuSprayCan, LuWind } from "react-icons/lu";
import { TODAY } from "@/components/appointments/data";
import { addMonths, type ISODate } from "@/components/appointments/dates";
import type { Tone } from "@/components/ui/tone-tile";
import { portraitUrl } from "@/lib/portraits";

export type PrescriptionStatus = "Active" | "Completed";

export type Prescription = {
  id: string;
  medication: string;
  /** What the medicine is for, in a sentence. */
  description: string;
  /** Strength, e.g. "90 mcg". */
  dosage: string;
  instructions: string;
  /** The condition it treats, e.g. "Asthma". */
  indication: string;
  prescriber: string;
  date: ISODate;
  status: PrescriptionStatus;
  quantity: string;
  refills: number;
  notes: string;
  icon: IconType;
  tone: Tone;
  /** Pharmacy the prescription was sent to, once it has been sent. */
  sentTo?: string;
};

export const prescribers = ["Dr. James Carter", "Dr. Sarah Kim", "Dr. Michael Brown", "Dr. Emily Chen"] as const;

/** Portraits for the people who prescribe. The rest of the clinic's doctors come from the doctors data. */
export const prescriberPhotos: Record<string, string> = {
  "Dr. James Carter": portraitUrl("men", 85),
  "Dr. Sarah Kim": portraitUrl("women", 21),
  "Dr. Michael Brown": portraitUrl("men", 11),
  "Dr. Emily Chen": portraitUrl("women", 8),
};

export const seedPrescriptions: Prescription[] = [
  {
    id: "rx1",
    medication: "Albuterol Inhaler",
    description: "For asthma management and quick relief of breathing difficulties.",
    dosage: "90 mcg",
    instructions: "Inhale 2 puffs every 4–6 hours as needed",
    indication: "Asthma",
    prescriber: "Dr. Sarah Kim",
    date: "2024-01-15",
    status: "Active",
    quantity: "1 inhaler",
    refills: 2,
    notes: "Use as a rescue inhaler for asthma symptoms. If using more than twice a week, schedule a follow-up appointment.",
    icon: LuWind,
    tone: "blue",
  },
  {
    id: "rx2",
    medication: "Amoxicillin",
    description: "An antibiotic that treats bacterial infections.",
    dosage: "500 mg",
    instructions: "Take 1 capsule three times daily for 7 days",
    indication: "Respiratory Infection",
    prescriber: "Dr. James Carter",
    date: "2023-11-03",
    status: "Completed",
    quantity: "21 capsules",
    refills: 0,
    notes: "Finish the full course even if symptoms improve. Take with food to reduce stomach upset.",
    icon: LuPill,
    tone: "coral",
  },
  {
    id: "rx3",
    medication: "Loratadine",
    description: "A non-drowsy antihistamine for seasonal allergy symptoms.",
    dosage: "10 mg",
    instructions: "Take 1 tablet once daily",
    indication: "Allergies",
    prescriber: "Dr. Michael Brown",
    date: "2023-08-18",
    status: "Completed",
    quantity: "30 tablets",
    refills: 0,
    notes: "Can be taken with or without food. Avoid combining with other antihistamines.",
    icon: LuPill,
    tone: "success",
  },
  {
    id: "rx4",
    medication: "Ibuprofen",
    description: "An anti-inflammatory for short-term pain and fever relief.",
    dosage: "400 mg",
    instructions: "Take 1 tablet every 8 hours as needed",
    indication: "Pain Relief",
    prescriber: "Dr. James Carter",
    date: "2023-05-02",
    status: "Completed",
    quantity: "20 tablets",
    refills: 0,
    notes: "Take with food. Do not exceed 3 tablets in 24 hours.",
    icon: LuPill,
    tone: "amber",
  },
  {
    id: "rx5",
    medication: "Fluticasone Nasal Spray",
    description: "A corticosteroid spray that eases nasal inflammation and congestion.",
    dosage: "50 mcg",
    instructions: "1 spray in each nostril once daily",
    indication: "Allergic Rhinitis",
    prescriber: "Dr. Emily Chen",
    date: "2023-01-10",
    status: "Completed",
    quantity: "1 bottle (120 sprays)",
    refills: 1,
    notes: "Shake gently before use. Full effect can take a few days of regular use.",
    icon: LuSprayCan,
    tone: "violet",
  },
];

/** Pharmacies a prescription can be sent to. */
export const pharmacies = ["CityCare Pharmacy · 214 Main St", "Green Cross Pharmacy · Sanova Clinic, Ground Floor", "Wellbeing Pharmacy · 88 Oak Avenue"] as const;

export const refillsLabel = (refills: number) => (refills > 0 ? `${refills} remaining` : "No refills");

/**
 * Renewing issues a new prescription for the same medication, dated today. If the original was still active it is
 * closed, so there is only ever one active prescription per renewal.
 */
export function renew(list: readonly Prescription[], id: string, newId: string): Prescription[] {
  const original = list.find((prescription) => prescription.id === id);
  if (!original) return [...list];
  const renewed: Prescription = { ...original, id: newId, date: TODAY, status: "Active", sentTo: undefined };
  return [renewed, ...list.map((prescription) => (prescription.id === id ? { ...prescription, status: "Completed" as const } : prescription))];
}

export const ranges = ["All Time", "Last 6 Months", "Last 12 Months"] as const;
export type Range = (typeof ranges)[number];

/** Earliest date a prescription can have to be inside `range`. */
export const rangeStart = (range: Range): ISODate =>
  range === "All Time" ? "0000-01-01" : addMonths(TODAY, range === "Last 6 Months" ? -6 : -12);

/** Colours given to prescriptions added from the form, in turn. */
export const newTones: Tone[] = ["teal", "blue", "amber", "violet", "coral", "success"];
