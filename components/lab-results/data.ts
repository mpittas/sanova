import type { IconType } from "react-icons";
import { LuDroplet, LuHeart, LuSun, LuTestTube, LuWaves } from "react-icons/lu";
import { TODAY } from "@/components/appointments/data";
import { addMonths, type ISODate } from "@/components/appointments/dates";
import type { ChipTone } from "@/components/ui/chip";
import type { Tone } from "@/components/ui/tone-tile";

// ---------------------------------------------------------------------------------------------
// Parameters: one measured value with its reference range. Everything else is derived from these.
// ---------------------------------------------------------------------------------------------

export type ParameterStatus = "Normal" | "Low" | "High";

export type Parameter = {
  name: string;
  value: number;
  unit: string;
  low: number;
  high: number;
  /** Decimal places used to show the value and its range. */
  decimals: number;
};

/** [name, value, unit, low, high, decimals] */
type Spec = [string, number, string, number, number, number];

const parameters = (specs: Spec[]): Parameter[] =>
  specs.map(([name, value, unit, low, high, decimals]) => ({ name, value, unit, low, high, decimals }));

export const statusOf = ({ value, low, high }: Parameter): ParameterStatus => (value < low ? "Low" : value > high ? "High" : "Normal");

export const formatValue = (parameter: Parameter, value = parameter.value) => value.toFixed(parameter.decimals);

/** "12.0 – 16.0", or "< 200" when there is no lower limit. */
export const formatRange = (parameter: Parameter) =>
  parameter.low === 0 ? `< ${parameter.high.toFixed(parameter.decimals)}` : `${parameter.low.toFixed(parameter.decimals)} – ${parameter.high.toFixed(parameter.decimals)}`;

/**
 * The last six readings of a parameter, oldest first, ending with the current value. Earlier readings are sample data:
 * a small deterministic wobble around the current value, so the server and client render the same chart.
 */
export function historyOf(parameter: Parameter, seed: number): number[] {
  const factor = 10 ** parameter.decimals;
  return Array.from({ length: 6 }, (_, index) => {
    if (index === 5) return parameter.value;
    const wobble = 1 + 0.07 * Math.sin(index * 1.9 + seed * 1.3);
    return Math.round(parameter.value * wobble * factor) / factor;
  });
}

// ---------------------------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------------------------

/** The headline result of a test. Derived: all normal, any value too low, or otherwise something too high. */
export type TestStatus = "Normal" | "Attention" | "Low";

export const testStatusMeta: Record<TestStatus, { chip: ChipTone; tone: Tone; title: string }> = {
  Normal: { chip: "success", tone: "primary", title: "Normal" },
  Attention: { chip: "warning", tone: "amber", title: "Attention" },
  Low: { chip: "danger", tone: "coral", title: "Low" },
};

export type LabComment = { author: string; when: ISODate; text: string };

export type LabTest = {
  id: string;
  name: string;
  /** Why it was ordered, e.g. "Routine Checkup". */
  reason: string;
  date: ISODate;
  orderedBy: string;
  icon: IconType;
  tone: Tone;
  parameters: Parameter[];
  comments: LabComment[];
};

export const labTests: LabTest[] = [
  {
    id: "cbc",
    name: "Complete Blood Count (CBC)",
    reason: "Routine Checkup",
    date: "2024-05-13",
    orderedBy: "Dr. James Carter",
    icon: LuDroplet,
    tone: "coral",
    parameters: parameters([
      ["Hemoglobin", 14.2, "g/dL", 12, 16, 1],
      ["White Blood Cells", 6.8, "×10³/µL", 4, 11, 1],
      ["Platelets", 268, "×10³/µL", 150, 400, 0],
      ["Red Blood Cells", 4.6, "×10⁶/µL", 4, 5.2, 1],
      ["Hematocrit", 42, "%", 36, 46, 0],
      ["MCV", 88, "fL", 80, 100, 0],
      ["MCH", 29.6, "pg", 27, 33, 1],
      ["MCHC", 33.8, "g/dL", 32, 36, 1],
      ["RDW", 13.1, "%", 11.5, 14.5, 1],
      ["Neutrophils", 58, "%", 40, 70, 0],
      ["Lymphocytes", 31, "%", 20, 45, 0],
      ["Monocytes", 7, "%", 2, 10, 0],
    ]),
    comments: [
      { author: "Dr. James Carter", when: "2024-05-14", text: "Blood count is healthy across the board. No follow-up needed; repeat at the next routine checkup." },
    ],
  },
  {
    id: "lipid",
    name: "Lipid Panel",
    reason: "Annual Checkup",
    date: "2024-04-02",
    orderedBy: "Dr. James Carter",
    icon: LuHeart,
    tone: "coral",
    parameters: parameters([
      ["Total Cholesterol", 214, "mg/dL", 0, 200, 0],
      ["LDL Cholesterol", 138, "mg/dL", 0, 130, 0],
      ["HDL Cholesterol", 58, "mg/dL", 40, 100, 0],
      ["Triglycerides", 112, "mg/dL", 0, 150, 0],
      ["VLDL Cholesterol", 22, "mg/dL", 5, 40, 0],
      ["Non-HDL Cholesterol", 156, "mg/dL", 0, 160, 0],
      ["Cholesterol / HDL Ratio", 3.7, "", 0, 5, 1],
      ["Fasting Glucose", 92, "mg/dL", 70, 99, 0],
    ]),
    comments: [
      { author: "Dr. James Carter", when: "2024-04-03", text: "Total and LDL cholesterol are slightly above range. Suggested dietary changes and a repeat panel in three months." },
      { author: "Dr. Sarah Chen", when: "2024-04-05", text: "Agree. HDL and triglycerides look good, so no medication for now." },
    ],
  },
  {
    id: "lft",
    name: "Liver Function Test (LFT)",
    reason: "Follow-up",
    date: "2023-11-28",
    orderedBy: "Dr. Michael Brown",
    icon: LuTestTube,
    tone: "violet",
    parameters: parameters([
      ["ALT", 24, "U/L", 7, 35, 0],
      ["AST", 22, "U/L", 8, 33, 0],
      ["Alkaline Phosphatase", 71, "U/L", 44, 121, 0],
      ["GGT", 18, "U/L", 5, 40, 0],
      ["Total Bilirubin", 0.8, "mg/dL", 0.2, 1.2, 1],
      ["Direct Bilirubin", 0.2, "mg/dL", 0.05, 0.3, 1],
      ["Albumin", 4.3, "g/dL", 3.5, 5, 1],
      ["Total Protein", 7.1, "g/dL", 6, 8.3, 1],
      ["Globulin", 2.8, "g/dL", 2, 3.5, 1],
      ["Albumin / Globulin Ratio", 1.5, "", 1.1, 2.5, 1],
    ]),
    comments: [{ author: "Dr. Michael Brown", when: "2023-11-29", text: "Liver enzymes are normal. Medication is being tolerated well." }],
  },
  {
    id: "thyroid",
    name: "Thyroid Panel",
    reason: "Routine Checkup",
    date: "2023-08-10",
    orderedBy: "Dr. Priya Shah",
    icon: LuWaves,
    tone: "blue",
    parameters: parameters([
      ["TSH", 2.1, "mIU/L", 0.4, 4, 1],
      ["Free T4", 1.2, "ng/dL", 0.8, 1.8, 1],
      ["Free T3", 3.1, "pg/mL", 2.3, 4.2, 1],
      ["Anti-TPO Antibodies", 12, "IU/mL", 0, 35, 0],
    ]),
    comments: [{ author: "Dr. Priya Shah", when: "2023-08-11", text: "Thyroid function is normal and antibodies are negative." }],
  },
  {
    id: "vitd",
    name: "Vitamin D",
    reason: "Deficiency Screening",
    date: "2023-05-02",
    orderedBy: "Dr. James Carter",
    icon: LuSun,
    tone: "amber",
    parameters: parameters([["25-OH Vitamin D", 18, "ng/mL", 30, 100, 0]]),
    comments: [{ author: "Dr. James Carter", when: "2023-05-03", text: "Below the recommended level. Started a daily supplement; retest in three months." }],
  },
];

export const statusOfTest = (test: LabTest): TestStatus => {
  const statuses = test.parameters.map(statusOf);
  if (statuses.includes("Low")) return "Low";
  return statuses.includes("High") ? "Attention" : "Normal";
};

export const abnormalParameters = (test: LabTest) => test.parameters.filter((parameter) => statusOf(parameter) !== "Normal");

/** "All values are within normal range." / "2 values are above the normal range." */
export function summarize(test: LabTest): string {
  const high = test.parameters.filter((parameter) => statusOf(parameter) === "High").length;
  const low = test.parameters.filter((parameter) => statusOf(parameter) === "Low").length;
  if (high + low === 0) return "All values are within normal range.";
  const part = (count: number, side: string) => `${count} ${count === 1 ? "value is" : "values are"} ${side} the normal range`;
  return [high > 0 && part(high, "above"), low > 0 && part(low, "below")].filter(Boolean).join(" and ") + ".";
}

/** The metrics highlighted on the overview: anything out of range first, then the first ones listed. */
export function keyMetrics(test: LabTest, count = 3): Parameter[] {
  const abnormal = abnormalParameters(test);
  const normal = test.parameters.filter((parameter) => statusOf(parameter) === "Normal");
  return [...abnormal, ...normal].slice(0, count);
}

// ---------------------------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------------------------

export const statusFilters = ["All Tests", "Normal", "Attention", "Low"] as const;
export type StatusFilter = (typeof statusFilters)[number];

export const ranges = ["Last 6 Months", "Last 12 Months", "All Time"] as const;
export type Range = (typeof ranges)[number];

/** Earliest date a test can have to be inside `range`. */
export const rangeStart = (range: Range): ISODate =>
  range === "All Time" ? "0000-01-01" : addMonths(TODAY, range === "Last 6 Months" ? -6 : -12);

export const detailTabs = ["Overview", "Results", "Trends", "Comments"] as const;
export type DetailTab = (typeof detailTabs)[number];
