import { LuCalendarDays, LuStethoscope, LuTrendingUp, LuUsers } from "react-icons/lu";
import { StatGrid, StatTile } from "@/components/ui/stat-tile";
import { buildTotals, type Department } from "./data";

/** Clinic-wide figures, derived from the department list. */
export function DepartmentStats({ departments }: { departments: readonly Department[] }) {
  const totals = buildTotals(departments);
  const tiles = [
    { id: "departments", label: "Total Departments", value: totals.departments, icon: LuUsers, tone: "primary" },
    { id: "doctors", label: "Total Doctors", value: totals.doctors, icon: LuStethoscope, tone: "violet" },
    { id: "appointments", label: "Monthly Appointments", value: totals.appointments.toLocaleString("en-US"), icon: LuCalendarDays, tone: "amber" },
    { id: "satisfaction", label: "Patient Satisfaction", value: `${totals.satisfaction}%`, icon: LuTrendingUp, tone: "success" },
  ] as const;

  return (
    <StatGrid>
      {tiles.map(({ id, ...tile }) => (
        <StatTile key={id} {...tile} />
      ))}
    </StatGrid>
  );
}
