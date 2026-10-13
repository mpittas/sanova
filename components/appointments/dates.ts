/** Small date helpers on ISO strings ("2024-05-09"). All maths is done in UTC so timezones never shift a day. */

export type ISODate = string;

const MS_PER_DAY = 86_400_000;

function parse(iso: ISODate) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function toISO(date: Date): ISODate {
  return date.toISOString().slice(0, 10);
}

export function addDays(iso: ISODate, days: number): ISODate {
  return toISO(new Date(parse(iso).getTime() + days * MS_PER_DAY));
}

export function addMonths(iso: ISODate, months: number): ISODate {
  const date = parse(iso);
  const day = date.getUTCDate();
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return toISO(target);
}

export const startOfWeek = (iso: ISODate) => addDays(iso, -parse(iso).getUTCDay());
export const startOfMonth = (iso: ISODate) => `${iso.slice(0, 7)}-01`;

export function endOfMonth(iso: ISODate): ISODate {
  const date = parse(iso);
  return toISO(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)));
}

export function formatDate(iso: ISODate, options: Intl.DateTimeFormatOptions) {
  return parse(iso).toLocaleDateString("en-US", { timeZone: "UTC", ...options });
}

/** Cells for a Sunday-first month grid, including leading/trailing days from adjacent months. */
export function monthGrid(iso: ISODate): { iso: ISODate; inMonth: boolean }[] {
  const first = startOfMonth(iso);
  const lead = parse(first).getUTCDay();
  const daysInMonth = parse(endOfMonth(iso)).getUTCDate();
  const weeks = Math.ceil((lead + daysInMonth) / 7);
  const gridStart = addDays(first, -lead);

  return Array.from({ length: weeks * 7 }, (_, index) => {
    const cell = addDays(gridStart, index);
    return { iso: cell, inMonth: cell.slice(0, 7) === first.slice(0, 7) };
  });
}

/** "13:30" -> "1:30 PM" */
export function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

export function addMinutes(time: string, minutes: number) {
  const [hours, mins] = time.split(":").map(Number);
  const total = hours * 60 + mins + minutes;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
