import { TODAY } from "@/components/appointments/data";
import { addDays, formatDate, formatTime } from "@/components/appointments/dates";
import type { Doctor } from "./data";

/** "Today, 1:30 PM", "Tomorrow, 9:00 AM", or "May 16, 2024" once it is further out. */
export function slotLabel({ date, time }: Doctor["next"]) {
  if (date === TODAY) return `Today, ${formatTime(time)}`;
  if (date === addDays(TODAY, 1)) return `Tomorrow, ${formatTime(time)}`;
  return formatDate(date, { month: "short", day: "numeric", year: "numeric" });
}
