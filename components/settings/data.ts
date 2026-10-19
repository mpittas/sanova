export const languages = ["English (US)", "English (UK)", "Español", "Français", "Deutsch"] as const;

export const timezones = [
  "Pacific Time (UTC-08:00)",
  "Mountain Time (UTC-07:00)",
  "Central Time (UTC-06:00)",
  "Eastern Time (UTC-05:00)",
  "London (UTC+00:00)",
] as const;

export const timeFormats = ["12-hour", "24-hour"] as const;
export type TimeFormat = (typeof timeFormats)[number];

export const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export type Day = (typeof days)[number];

export const slotLengths = ["15 min", "20 min", "30 min", "45 min", "60 min"] as const;
export const sessionTimeouts = ["15 minutes", "30 minutes", "1 hour", "4 hours"] as const;

export type ToggleSetting = { id: string; title: string; description: string; on: boolean };

export const appointmentAlerts: ToggleSetting[] = [
  { id: "booked", title: "New bookings", description: "When a patient books or requests a visit.", on: true },
  { id: "cancelled", title: "Cancellations and changes", description: "When a visit is cancelled or moved.", on: true },
  { id: "daily", title: "Daily agenda", description: "Your schedule for the day, sent at 7:00 am.", on: false },
];

export const clinicalAlerts: ToggleSetting[] = [
  { id: "labs", title: "Lab results ready", description: "When results arrive for one of your patients.", on: true },
  { id: "critical", title: "Critical values", description: "Abnormal results that need action today.", on: true },
  { id: "refills", title: "Refill requests", description: "When a patient asks to renew a prescription.", on: false },
];

export const channels: ToggleSetting[] = [
  { id: "email", title: "Email", description: "james.carter@sanova.health", on: true },
  { id: "push", title: "Push notifications", description: "On this and other signed-in devices.", on: true },
  { id: "sms", title: "Text message", description: "Only for critical values.", on: false },
];

export const devices = [
  { id: "mac", name: "MacBook Pro · Chrome", place: "San Francisco, US", current: true, seen: "Active now" },
  { id: "phone", name: "iPhone 16 · Sanova app", place: "San Francisco, US", current: false, seen: "2 hours ago" },
  { id: "ipad", name: "iPad · Safari", place: "Oakland, US", current: false, seen: "3 days ago" },
] as const;
