import { NOW, TODAY, patientDirectory } from "@/components/appointments/data";
import { addDays, addMinutes, dayOfWeek, type ISODate } from "@/components/appointments/dates";
import type { Doctor, Specialty } from "./data";

/** Small stable number from a string, so every doctor gets the same sample details on every render. */
function hash(text: string) {
  return [...text].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) % 100_003, 7);
}

const pick = <T,>(list: readonly T[], seed: number, offset = 0) => list[(seed + offset) % list.length];

// ---------------------------------------------------------------------------------------------
// About, focus areas, training
// ---------------------------------------------------------------------------------------------

const focusAreas: Record<Specialty, string[]> = {
  "General Practice": ["Preventive care", "Chronic disease management", "Annual physicals", "Vaccinations", "Women’s & men’s health"],
  Cardiology: ["Hypertension", "Heart failure", "Arrhythmia care", "Cardiac imaging", "Cholesterol management"],
  Dermatology: ["Acne & rosacea", "Skin cancer screening", "Eczema & psoriasis", "Cosmetic dermatology", "Pediatric skin care"],
  Pediatrics: ["Well-child visits", "Growth & development", "Childhood immunizations", "Asthma & allergies", "Adolescent health"],
  Orthopedics: ["Joint replacement", "Sports injuries", "Fracture care", "Spine conditions", "Physical rehabilitation"],
  Gynecology: ["Prenatal care", "Family planning", "Menopause care", "Minimally invasive surgery", "Annual exams"],
  Neurology: ["Migraine & headache", "Epilepsy", "Stroke recovery", "Movement disorders", "Memory & cognition"],
};

const visitTypes: Record<Specialty, string[]> = {
  "General Practice": ["General Consultation", "Annual Physical", "Follow-up Visit", "Vaccination"],
  Cardiology: ["Cardiology Consultation", "ECG Review", "Blood Pressure Check", "Follow-up Visit"],
  Dermatology: ["Skin Check", "Acne Review", "Follow-up Visit", "Mole Screening"],
  Pediatrics: ["Well-child Visit", "Vaccination", "Growth Check", "Follow-up Visit"],
  Orthopedics: ["Joint Assessment", "Post-op Review", "Sports Injury", "Follow-up Visit"],
  Gynecology: ["Annual Exam", "Prenatal Visit", "Contraception Advice", "Follow-up Visit"],
  Neurology: ["Neurology Consultation", "Headache Review", "Memory Assessment", "Follow-up Visit"],
};

const medicalSchools = ["Northbridge School of Medicine", "St. Aurelia University", "Lakeview College of Medicine", "Harbor Point Medical School"];
const hospitals = ["Riverside University Hospital", "St. Aurelia Medical Center", "Lakeview Teaching Hospital", "Summit Health Institute"];
const languagePool = [["English", "Spanish"], ["English"], ["English", "French"], ["English", "Mandarin"], ["English", "Hindi", "Gujarati"], ["English", "Portuguese"]];

export type Credential = { year: number; title: string; place: string };

function about(doctor: Doctor) {
  const years = `${doctor.experience} years`;
  const area = doctor.specialty.toLowerCase();
  const lead = `${doctor.name} is a ${doctor.title.toLowerCase()} with ${years} in practice, caring for ${doctor.patients} patients at ${doctor.location.site}.`;
  const style: Record<Specialty, string> = {
    "General Practice": "Known for unhurried visits and clear plans, they look after the whole person: prevention first, long-term conditions steadily managed.",
    Cardiology: "They pair careful diagnostics with straightforward explanations, helping patients understand their heart health and the choices ahead.",
    Dermatology: "They combine medical and cosmetic expertise, with a focus on early detection and treatments that fit each patient’s skin and routine.",
    Pediatrics: "Parents value their calm, playful approach: children feel at ease, and families leave every visit with answers.",
    Orthopedics: "They guide patients from first assessment through surgery and rehabilitation, with a focus on getting people moving again.",
    Gynecology: "They offer respectful, judgement-free care across every stage of life, from routine exams to complex procedures.",
    Neurology: "They take time to listen, then build a precise picture of complex conditions, with care plans that evolve as patients do.",
  };
  return `${lead} ${style[doctor.specialty]} Their ${area} practice welcomes new patients and referrals.`;
}

function training(doctor: Doctor): Credential[] {
  const seed = hash(doctor.id);
  const graduated = Number(TODAY.slice(0, 4)) - doctor.experience - 5;
  return [
    { year: graduated, title: "Doctor of Medicine (MD)", place: pick(medicalSchools, seed) },
    { year: graduated + 4, title: `Residency, ${doctor.specialty === "General Practice" ? "Internal Medicine" : doctor.specialty}`, place: pick(hospitals, seed, 1) },
    { year: graduated + 5, title: `Board certified, ${doctor.specialty}`, place: "American Board of Medical Specialties" },
  ];
}

// ---------------------------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------------------------

export type Review = { id: string; patient: string; rating: number; when: ISODate; text: string };

const reviewPool: Omit<Review, "id" | "when">[] = [
  { patient: "Emily Carter", rating: 5, text: "Listened to every question and explained the plan in plain language. I left feeling genuinely looked after." },
  { patient: "James Miller", rating: 5, text: "Punctual, thorough and kind. Follow-up was handled quickly through the portal without any chasing." },
  { patient: "Sophia Nguyen", rating: 4, text: "Very knowledgeable and reassuring. The wait was a little longer than usual, but the visit itself was excellent." },
  { patient: "Daniel Lee", rating: 5, text: "The best experience I have had at a clinic. Clear next steps and a warm, professional manner throughout." },
  { patient: "Robert Kim", rating: 5, text: "Took the time to go through my results line by line. I finally understand what is going on with my health." },
  { patient: "Olivia Torres", rating: 4, text: "Friendly and efficient. Easy to book, easy to reach, and the advice has made a real difference." },
];

/** Rating bars for 5★ to 1★ as percentages. The shape is tilted until its mean matches the doctor’s average. */
function distribution(rating: number) {
  const weightsFor = (tilt: number) => [5, 4, 3, 2, 1].map((stars) => Math.exp(tilt * stars));
  const meanFor = (tilt: number) => {
    const weights = weightsFor(tilt);
    return weights.reduce((sum, weight, index) => sum + weight * (5 - index), 0) / weights.reduce((sum, weight) => sum + weight, 0);
  };

  let low = 0;
  let high = 12;
  for (let step = 0; step < 40; step += 1) {
    const middle = (low + high) / 2;
    if (meanFor(middle) < rating) low = middle;
    else high = middle;
  }

  const weights = weightsFor((low + high) / 2);
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const shares = weights.map((weight) => Math.round((weight / total) * 100));
  shares[0] += 100 - shares.reduce((sum, share) => sum + share, 0);
  return shares.map((share, index) => ({ stars: 5 - index, share }));
}

// ---------------------------------------------------------------------------------------------
// Availability
// ---------------------------------------------------------------------------------------------

export type DaySlots = { date: ISODate; times: string[] };

const morning = ["08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
const afternoon = ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

/**
 * The next seven bookable days. Nothing is offered before the doctor's next free slot (or return date),
 * today's list skips times that have passed, and the rest is thinned out deterministically so no two days look alike.
 */
export function availability(doctor: Doctor): DaySlots[] {
  const days: DaySlots[] = [];
  const seed = hash(doctor.id);

  for (let offset = 0; days.length < 7 && offset < 21; offset += 1) {
    const date = addDays(TODAY, offset);
    const weekday = dayOfWeek(date);
    if (weekday === 0) continue; // Closed on Sundays.

    const day = weekday === 6 ? morning.slice(0, 4) : [...morning, ...afternoon];
    const times = day.filter((time, index) => {
      if (date < doctor.next.date) return false;
      if (date === doctor.next.date && time < doctor.next.time) return false;
      if (date === TODAY && time <= NOW) return false;
      if (date === doctor.next.date && time === doctor.next.time) return true;
      return (seed + offset * 7 + index * 3) % 5 !== 0 && (seed + offset + index) % 3 !== 0;
    });
    days.push({ date, times });
  }
  return days;
}

export const workingHours = [
  { days: "Monday – Friday", hours: "8:30 AM – 5:00 PM" },
  { days: "Saturday", hours: "8:30 AM – 12:30 PM" },
  { days: "Sunday", hours: "Closed" },
] as const;

// ---------------------------------------------------------------------------------------------
// Today's visits
// ---------------------------------------------------------------------------------------------

export type TodayVisit = { id: string; time: string; patient: string; visit: string; state: "done" | "now" | "next" };

function todayVisits(doctor: Doctor): TodayVisit[] {
  if (doctor.status === "On Leave") return [];
  const seed = hash(doctor.id);
  const starts = ["09:00", "10:30", "11:30", "14:00", "15:30"].slice(seed % 2, (seed % 2) + 4);
  return starts.map((time, index) => {
    const end = addMinutes(time, 30);
    const state = end <= NOW ? "done" : time <= NOW ? "now" : "next";
    return {
      id: `${doctor.id}-v${index}`,
      time,
      patient: pick(patientDirectory, seed, index * 5)[0],
      visit: pick(visitTypes[doctor.specialty], seed, index),
      state,
    };
  });
}

// ---------------------------------------------------------------------------------------------
// Everything the profile page shows
// ---------------------------------------------------------------------------------------------

export function buildProfile(doctor: Doctor) {
  const seed = hash(doctor.id);
  const [first, ...rest] = doctor.name.replace(/^Dr\.?\s+/i, "").split(" ");
  const last = rest.join(" ").toLowerCase().replace(/\s+/g, "-");

  return {
    about: about(doctor),
    focus: focusAreas[doctor.specialty],
    training: training(doctor),
    languages: pick(languagePool, seed),
    email: `${first.toLowerCase()}.${last}@sanova.health`,
    phone: `+1 (555) 01${String(seed % 90 + 10)}-${String(1000 + (seed * 7) % 9000)}`,
    reviews: Array.from({ length: 3 }, (_, index): Review => {
      const sample = pick(reviewPool, seed, index * 2);
      return { ...sample, id: `${doctor.id}-r${index}`, when: addDays(TODAY, -(9 + ((seed + index * 11) % 40) + index * 14)) };
    }),
    distribution: distribution(doctor.rating),
    days: availability(doctor),
    today: todayVisits(doctor),
  };
}

export type DoctorProfile = ReturnType<typeof buildProfile>;
