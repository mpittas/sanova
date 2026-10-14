import { TODAY } from "@/components/appointments/data";
import { addDays, formatTime } from "@/components/appointments/dates";
import type { UploadedImage } from "@/components/ui/image-upload";
import type { Step } from "@/components/ui/stepper";
import { specialties, type Doctor, type Specialty } from "./data";

export const steps: readonly (Step & { title: string; intro: string })[] = [
  { label: "Basic Information", description: "Personal and professional details", title: "Basic Information", intro: "Add the doctor's personal and professional details." },
  { label: "Specialties & Services", description: "Select specialties and services", title: "Specialties & Services", intro: "Choose what this doctor focuses on and which services they offer." },
  { label: "Schedule & Availability", description: "Set working hours and location", title: "Schedule & Availability", intro: "Set the days and hours this doctor sees patients, and where." },
  { label: "Additional Information", description: "Bio, education and languages", title: "Additional Information", intro: "Help patients get to know this doctor. You can edit all of this later." },
  { label: "Review & Confirm", description: "Check details before adding", title: "Review & Confirm", intro: "Check everything below, then add the doctor to your team." },
];

export const titleOptions = [
  "General Practitioner",
  "Family Physician",
  "Internist",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Orthopedic Surgeon",
  "Gynecologist",
  "Neurologist",
] as const;
export const genderOptions = ["Female", "Male", "Non-binary", "Prefer not to say"] as const;
export const employmentOptions = ["Full-time", "Part-time", "Contract", "Locum"] as const;
export const departmentOptions = specialties;

export const focusAreas: Record<Specialty, readonly string[]> = {
  "General Practice": ["Preventive care", "Chronic conditions", "Minor procedures", "Health screening"],
  Cardiology: ["Heart failure", "Arrhythmia", "Hypertension", "Cardiac imaging"],
  Dermatology: ["Acne and rosacea", "Skin cancer checks", "Eczema", "Cosmetic care"],
  Pediatrics: ["Newborn care", "Vaccinations", "Growth and development", "Adolescent health"],
  Orthopedics: ["Joint replacement", "Sports injuries", "Spine care", "Fracture care"],
  Gynecology: ["Prenatal care", "Menopause", "Fertility", "Family planning"],
  Neurology: ["Migraine", "Epilepsy", "Stroke recovery", "Movement disorders"],
};

export const serviceOptions = [
  "In-person consultations",
  "Telehealth visits",
  "Prescription renewals",
  "Lab result reviews",
  "Home visits",
  "Second opinions",
] as const;

export const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
/** Index in `dayOptions` -> JS weekday (0 = Sunday). */
const weekdayOf = (day: (typeof dayOptions)[number]) => (dayOptions.indexOf(day) + 1) % 7;

const timeValues = Array.from({ length: 25 }, (_, index) => {
  const minutes = 7 * 60 + index * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
});
export const timeOptions = timeValues.map(formatTime);
const to24 = (label: string) => timeValues[timeOptions.indexOf(label)] ?? "09:00";

export const slotOptions = ["15 min", "20 min", "30 min", "45 min", "60 min"] as const;
export const siteOptions = ["Main Clinic", "West Wing", "East Wing"] as const;
export const floorOptions = ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"] as const;
export const languageOptions = ["English", "Spanish", "French", "German", "Greek", "Arabic", "Mandarin", "Hindi"] as const;

export const BIO_LIMIT = 300;

export type Draft = {
  name: string;
  title: string;
  gender: string;
  email: string;
  phone: string;
  license: string;
  experience: string;
  department: Specialty | "";
  employment: string;
  photo: UploadedImage | null;
  focus: string[];
  services: string[];
  days: string[];
  start: string;
  end: string;
  slot: string;
  site: string;
  floor: string;
  education: string;
  bio: string;
  languages: string[];
};

export const emptyDraft: Draft = {
  name: "",
  title: "",
  gender: "",
  email: "",
  phone: "",
  license: "",
  experience: "",
  department: "",
  employment: "",
  photo: null,
  focus: [],
  services: ["In-person consultations"],
  days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  start: "9:00 AM",
  end: "5:00 PM",
  slot: "30 min",
  site: "",
  floor: "",
  education: "",
  bio: "",
  languages: ["English"],
};

export type Errors = Partial<Record<keyof Draft, string>>;

const minutesOf = (label: string) => {
  const [hours, minutes] = to24(label).split(":").map(Number);
  return hours * 60 + minutes;
};

/** Problems with the fields on `step`, each saying what is wrong and how to fix it. Empty when the step is valid. */
export function validate(step: number, draft: Draft): Errors {
  const errors: Errors = {};

  if (step === 0) {
    if (!draft.name.trim()) errors.name = "Enter the doctor's full name.";
    if (!draft.title) errors.title = "Choose a professional title.";
    if (!/^\S+@\S+\.\S+$/.test(draft.email.trim())) errors.email = "Enter an email address like name@clinic.com.";
    if (draft.phone.replace(/\D/g, "").length < 7) errors.phone = "Enter a phone number with at least 7 digits.";
    if (!draft.license.trim()) errors.license = "Enter the medical license number.";
    const years = Number(draft.experience);
    if (draft.experience.trim() === "" || !Number.isFinite(years) || years < 0 || years > 60) {
      errors.experience = "Enter years of experience, from 0 to 60.";
    }
    if (!draft.department) errors.department = "Choose a department.";
  }

  if (step === 2) {
    if (draft.days.length === 0) errors.days = "Choose at least one working day.";
    if (minutesOf(draft.end) <= minutesOf(draft.start)) errors.end = "End time must be after the start time.";
    if (!draft.site) errors.site = "Choose where this doctor works.";
    if (!draft.floor) errors.floor = "Choose a floor.";
  }

  return errors;
}

/** The first step (0-based) that has problems, or null when the whole draft is valid. */
export function firstInvalidStep(draft: Draft): number | null {
  const index = [0, 2].find((step) => Object.keys(validate(step, draft)).length > 0);
  return index ?? null;
}

/** Builds the doctor shown on the Doctors page from the finished form. */
export function toDoctor(draft: Draft, id: string): Doctor {
  const name = draft.name.trim();
  const workdays = draft.days.map((day) => weekdayOf(day as (typeof dayOptions)[number]));
  const firstDay = Array.from({ length: 7 }, (_, offset) => addDays(TODAY, offset)).find((date) =>
    workdays.includes(new Date(`${date}T00:00:00Z`).getUTCDay()),
  );

  return {
    id,
    name: /^dr\.?\s/i.test(name) ? name : `Dr. ${name}`,
    specialty: draft.department as Specialty,
    title: draft.title,
    patients: 0,
    experience: Number(draft.experience),
    location: { site: draft.site, floor: draft.floor },
    rating: 0,
    reviews: 0,
    status: "Active",
    next: { date: firstDay ?? TODAY, time: to24(draft.start) },
    photo: draft.photo?.url ?? "",
  };
}
