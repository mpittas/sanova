import { TODAY } from "@/components/appointments/data";
import { addDays } from "@/components/appointments/dates";

export type Invoice = {
  id: string;
  patient: string;
  service: string;
  amount: number;
  issued: string;
  due: string;
  state: "Paid" | "Unpaid" | "Draft";
  payer: "Patient" | "Insurance";
};
export type InvoiceStatus = "Paid" | "Unpaid" | "Overdue" | "Draft";
export const statusOf = (invoice: Invoice): InvoiceStatus => invoice.state === "Unpaid" && invoice.due < TODAY ? "Overdue" : invoice.state;
export const money = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(cents / 100);
export const patients = ["Emily Carter", "James Miller", "Sophia Nguyen", "Daniel Lee", "Robert Kim", "Olivia Torres", "Ava Patel", "Mia Wong"] as const;
export const services = { "General consultation": 120, "Specialist consultation": 240, "Lab panel": 85, "Annual physical": 180, "Teleconsultation": 75, "Follow-up visit": 95 } as const;

const rows: [string, keyof typeof services, number, number, Invoice["state"], Invoice["payer"], number?][] = [
  ["Emily Carter", "General consultation", -1, 13, "Paid", "Patient"],
  ["James Miller", "Specialist consultation", -2, 12, "Unpaid", "Insurance"],
  ["Sophia Nguyen", "Lab panel", -3, -1, "Unpaid", "Patient"],
  ["Daniel Lee", "Annual physical", -4, 10, "Paid", "Insurance"],
  ["Robert Kim", "Specialist consultation", -5, 9, "Unpaid", "Insurance"],
  ["Olivia Torres", "Teleconsultation", -6, 8, "Paid", "Patient"],
  ["Ava Patel", "Follow-up visit", -7, -2, "Unpaid", "Patient"],
  ["Mia Wong", "Lab panel", -8, 6, "Draft", "Patient"],
  ["James Miller", "Follow-up visit", -15, -1, "Unpaid", "Patient"],
  ["Emily Carter", "Annual physical", -18, -4, "Paid", "Insurance"],
  ["Robert Kim", "General consultation", -23, -9, "Paid", "Patient"],
  ["Daniel Lee", "Lab panel", -27, -13, "Paid", "Insurance"],
  ["Mia Wong", "Specialist consultation", -10, 4, "Paid", "Insurance", 4],
  ["Ava Patel", "Annual physical", -12, 2, "Paid", "Insurance", 3],
  ["Robert Kim", "Lab panel", -20, -6, "Unpaid", "Patient", 2],
  ["Emily Carter", "Specialist consultation", -22, -8, "Paid", "Insurance", 5],
  ["Sophia Nguyen", "General consultation", -25, -11, "Paid", "Patient"],
  ["Ava Patel", "Specialist consultation", -30, -16, "Paid", "Insurance", 3],
  ["Mia Wong", "Annual physical", -33, -19, "Paid", "Patient", 2],
  ["Sophia Nguyen", "Follow-up visit", -36, -22, "Paid", "Insurance"],
  ["Daniel Lee", "Specialist consultation", -40, -26, "Unpaid", "Insurance", 4],
  ["Olivia Torres", "Lab panel", -44, -30, "Paid", "Patient", 5],
  ["Robert Kim", "Annual physical", -48, -34, "Paid", "Insurance"],
  ["Emily Carter", "Teleconsultation", -52, -38, "Paid", "Patient"],
  ["James Miller", "Specialist consultation", -57, -43, "Paid", "Insurance", 6],
  ["Ava Patel", "General consultation", -61, -47, "Paid", "Patient"],
  ["Mia Wong", "Specialist consultation", -66, -52, "Unpaid", "Insurance", 3],
  ["Sophia Nguyen", "Lab panel", -70, -56, "Paid", "Patient", 2],
  ["Daniel Lee", "Follow-up visit", -75, -61, "Paid", "Patient"],
  ["Olivia Torres", "Specialist consultation", -80, -66, "Paid", "Insurance", 5],
  ["Robert Kim", "Teleconsultation", -84, -70, "Paid", "Patient"],
];
export const seedInvoices: Invoice[] = rows.map(([patient, service, issued, due, state, payer, multiplier = 1], index) => ({ id: `INV-${1048 - index}`, patient, service, amount: services[service] * 100 * multiplier, issued: addDays(TODAY, issued), due: addDays(TODAY, due), state, payer }));
