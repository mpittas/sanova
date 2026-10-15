import type { ISODate } from "@/components/appointments/dates";
import { ageOn } from "@/components/patients/data";
import type { Tone } from "@/components/ui/tone-tile";
import { portraitUrl } from "@/lib/portraits";

export const patient = {
  name: "Olivia Bennett",
  gender: "Female",
  dob: "1996-04-14" as ISODate,
  id: "#45872",
  phone: "+1 (555) 010-4829",
  email: "olivia.bennett@email.com",
  location: "Sanova Clinic",
  status: "Active Patient",
  photo: portraitUrl("women", 90),
};

export const patientAge = ageOn(patient.dob);

/** Key health facts shown on the medical record, and (allergies) on other record pages. */
export const healthFacts: { id: string; value: string; label: string; icon: "heart" | "allergy" | "lungs" | "pill"; tone: Tone }[] = [
  { id: "blood", value: "A+", label: "Blood Type", icon: "heart", tone: "coral" },
  { id: "allergies", value: "Peanuts, Penicillin", label: "Allergies", icon: "allergy", tone: "success" },
  { id: "condition", value: "Asthma", label: "Chronic Condition", icon: "lungs", tone: "blue" },
  { id: "medications", value: "2 Medications", label: "Current Medications", icon: "pill", tone: "violet" },
];
