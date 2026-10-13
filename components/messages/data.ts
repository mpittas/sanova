import { TODAY } from "@/components/appointments/data";
import { addDays, formatDate, formatTime, type ISODate } from "@/components/appointments/dates";

export type Attachment = { name: string; size: string };

export type ChatMessage = {
  id: string;
  from: "them" | "me";
  text: string;
  date: ISODate;
  /** 24h "HH:mm" */
  time: string;
  /** Only meaningful for messages sent by me. */
  status?: "sent" | "read";
  attachment?: Attachment;
};

export type Conversation = {
  id: string;
  kind: "patient" | "care-team";
  name: string;
  /** MRN for patients, role for the care team. */
  detail: string;
  online: boolean;
  unread: number;
  messages: ChatMessage[];
};

type Seed = [from: "them" | "me", date: ISODate, time: string, text: string];

const YESTERDAY = addDays(TODAY, -1);

function thread(id: string, entries: Seed[]): ChatMessage[] {
  return entries.map(([from, date, time, text], index) => ({
    id: `${id}-${index}`,
    from,
    date,
    time,
    text,
    status: from === "me" ? "read" : undefined,
  }));
}

export const seedConversations: Conversation[] = [
  {
    id: "c1",
    kind: "patient",
    name: "Emily Carter",
    detail: "CC-1001",
    online: true,
    unread: 2,
    messages: thread("c1", [
      ["them", TODAY, "10:14", "Hi Dr. Carter, I wanted to follow up on my lab results from last week. Please let me know if everything looks good!"],
      ["me", TODAY, "10:28", "Hi Emily! Your lab results look great — everything is within normal ranges. Let me know if you have any questions."],
      ["them", TODAY, "10:41", "That's great to hear! I also wanted to confirm my appointment for next week. Is Tuesday at 10 AM still available?"],
      ["me", TODAY, "10:42", "Yes, Tuesday at 10 AM is still available. I've confirmed your appointment. See you then!"],
      ["them", TODAY, "10:42", "Thank you! That works for me."],
    ]),
  },
  {
    id: "c2",
    kind: "patient",
    name: "James Miller",
    detail: "CC-1002",
    online: false,
    unread: 1,
    messages: thread("c2", [
      ["them", TODAY, "09:05", "Hi Dr. Carter, I started the new medication on Monday."],
      ["them", TODAY, "09:15", "I'm experiencing some mild side effects — mostly drowsiness in the afternoon. Is that normal?"],
    ]),
  },
  {
    id: "c3",
    kind: "care-team",
    name: "Jessica Lee",
    detail: "Registered Nurse",
    online: true,
    unread: 0,
    messages: thread("c3", [
      ["them", TODAY, "08:45", "Room 3 is ready. Mr. Miller's vitals are in the chart."],
    ]),
  },
  {
    id: "c4",
    kind: "care-team",
    name: "Dr. Michael Brown",
    detail: "Cardiology",
    online: false,
    unread: 0,
    messages: thread("c4", [
      ["them", YESTERDAY, "16:05", "Can you cover my 2 PM consult on Friday? Family emergency, sorry for the short notice."],
      ["me", YESTERDAY, "16:12", "Of course, no problem. Hope everything is okay."],
      ["them", YESTERDAY, "16:20", "Thank you, I owe you one."],
    ]),
  },
  {
    id: "c5",
    kind: "patient",
    name: "Sophia Nguyen",
    detail: "CC-1003",
    online: false,
    unread: 0,
    messages: thread("c5", [
      ["them", addDays(TODAY, -3), "15:30", "Hi, would it be possible to reschedule my appointment?"],
      ["me", addDays(TODAY, -3), "16:02", "Of course, I have Friday at 2:30 PM open."],
      ["them", YESTERDAY, "14:10", "Friday at 2:30 PM works for me."],
      ["me", YESTERDAY, "14:15", "Perfect, you're booked in."],
      ["them", YESTERDAY, "14:22", "Great, see you then!"],
    ]),
  },
  {
    id: "c6",
    kind: "patient",
    name: "Robert Kim",
    detail: "CC-1005",
    online: false,
    unread: 0,
    messages: thread("c6", [
      ["them", YESTERDAY, "11:05", "Could you send over my test results?"],
    ]),
  },
  {
    id: "c7",
    kind: "patient",
    name: "Olivia Torres",
    detail: "CC-1006",
    online: false,
    unread: 0,
    messages: thread("c7", [
      ["me", addDays(TODAY, -2), "13:40", "Your prescription has been sent to the pharmacy."],
      ["them", addDays(TODAY, -2), "13:52", "Thank you for your help!"],
    ]),
  },
  {
    id: "c8",
    kind: "patient",
    name: "Daniel Lee",
    detail: "CC-1004",
    online: false,
    unread: 0,
    messages: thread("c8", [
      ["them", addDays(TODAY, -3), "09:30", "I have a question about my prescription. Can I take it with food?"],
    ]),
  },
  {
    id: "c9",
    kind: "patient",
    name: "Ava Patel",
    detail: "CC-1007",
    online: false,
    unread: 0,
    messages: thread("c9", [
      ["them", addDays(TODAY, -5), "17:20", "Is there anything I should do before my appointment?"],
    ]),
  },
  {
    id: "c10",
    kind: "patient",
    name: "Liam Brooks",
    detail: "CC-1008",
    online: false,
    unread: 0,
    messages: thread("c10", [
      ["me", addDays(TODAY, -8), "10:10", "Your vaccination record has been updated."],
      ["them", addDays(TODAY, -8), "10:31", "Thank you, I appreciate it."],
    ]),
  },
];

// ---------------------------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------------------------

export const lastMessage = (conversation: Conversation) => conversation.messages[conversation.messages.length - 1];

/** Newest first. */
export function byLatest(a: Conversation, b: Conversation) {
  const x = lastMessage(a);
  const y = lastMessage(b);
  return `${y.date}${y.time}`.localeCompare(`${x.date}${x.time}`);
}

/** Conversation list timestamp: time today, "Yesterday", weekday this week, otherwise "May 1". */
export function listTimeLabel(message: Pick<ChatMessage, "date" | "time">) {
  if (message.date === TODAY) return formatTime(message.time);
  if (message.date === YESTERDAY) return "Yesterday";
  if (message.date > addDays(TODAY, -7)) return formatDate(message.date, { weekday: "short" });
  return formatDate(message.date, { month: "short", day: "numeric" });
}

/** Divider label inside a thread. */
export function dayLabel(date: ISODate) {
  if (date === TODAY) return "Today";
  if (date === YESTERDAY) return "Yesterday";
  return formatDate(date, { weekday: "short", month: "short", day: "numeric" });
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
