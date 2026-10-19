"use client";

import { useMemo, useState } from "react";
import { LuCalendarDays, LuChevronDown, LuCreditCard, LuLifeBuoy, LuLock, LuMail, LuRocket, LuSearchX, LuUsers, LuVideo } from "react-icons/lu";
import type { IconType } from "react-icons";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { ToneTile, type Tone } from "@/components/ui/tone-tile";
import styles from "./help.module.css";

const topics: { name: string; blurb: string; icon: IconType; tone: Tone }[] = [
  { name: "Getting started", blurb: "Set up your clinic in minutes", icon: LuRocket, tone: "primary" },
  { name: "Appointments", blurb: "Book, move and cancel visits", icon: LuCalendarDays, tone: "blue" },
  { name: "Patients", blurb: "Records, prescriptions and labs", icon: LuUsers, tone: "violet" },
  { name: "Telemedicine", blurb: "Secure video consultations", icon: LuVideo, tone: "teal" },
  { name: "Billing", blurb: "Invoices, payers and exports", icon: LuCreditCard, tone: "amber" },
  { name: "Account & security", blurb: "Sign-in, devices and privacy", icon: LuLock, tone: "coral" },
];
type Topic = (typeof topics)[number]["name"];

const faqs: { topic: Topic; q: string; a: string }[] = [
  { topic: "Getting started", q: "How do I invite my team?", a: "Open Settings, then Clinic, and add your colleagues by email. They get a link to create their own sign-in and see only the areas their role allows." },
  { topic: "Getting started", q: "Can I jump to anything quickly?", a: "Yes. Press Ctrl K (or ⌘K on a Mac) anywhere to open the command menu. Type a patient, a doctor, a page or an action, then press Enter. Press / to open it without the modifier key." },
  { topic: "Appointments", q: "How do I move an appointment?", a: "Open Appointments, pick the visit and choose Reschedule. The patient is notified automatically and the old slot opens up for someone else." },
  { topic: "Appointments", q: "What does Checked In mean?", a: "A patient is marked as checked in when they arrive at the clinic or join the waiting room of a video visit. You will see a notification and the status chip turns green." },
  { topic: "Patients", q: "Where do I find a patient's lab results?", a: "Go to Lab Results for the full list, or open the patient's Medical Records to see results alongside their visits, medications and documents." },
  { topic: "Patients", q: "How do I send a prescription?", a: "From Prescriptions choose New Prescription, pick the medication, set the dose and instructions, and send it to the patient's pharmacy." },
  { topic: "Telemedicine", q: "What do patients need for a video visit?", a: "Just a link. They open it in any modern browser on a phone or computer, allow the camera and microphone, and wait in the lobby until you start the session." },
  { topic: "Billing", q: "Can I export my invoices?", a: "Yes. On Billing use Export CSV for the invoices in view, or open one invoice and choose Download CSV. Filters you apply are respected." },
  { topic: "Billing", q: "Why is an invoice marked Overdue?", a: "An unpaid invoice becomes overdue the day after its due date. You can find them quickly with the Needs attention panel on Billing." },
  { topic: "Account & security", q: "How do I turn on two-step verification?", a: "Open Settings, then Security, and switch on Two-step verification. You will be asked for a code from your phone each time you sign in on a new device." },
];

const shortcuts = [
  { keys: ["Ctrl", "K"], what: "Open the command menu" },
  { keys: ["/"], what: "Open the command menu" },
  { keys: ["↑", "↓"], what: "Move through results" },
  { keys: ["Enter"], what: "Open the highlighted result" },
  { keys: ["Esc"], what: "Close menus and dialogs" },
];

export function HelpView() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<Topic | null>(null);
  const [open, setOpen] = useState<string | null>(faqs[0].q);

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return faqs.filter((item) => (!topic || item.topic === topic) && (!needle || `${item.q} ${item.a}`.toLowerCase().includes(needle)));
  }, [query, topic]);

  return (
    <div className={styles.page}>
      <PageHeader title="Help Center" description="Quick answers, tips and ways to reach us." />

      <section className={styles.hero}>
        <h2>How can we help?</h2>
        <p>Search the guides, or pick a topic below.</p>
        <SearchInput label="Search help articles" placeholder="Search for answers…" wrapperClassName={styles.search} value={query} onChange={(event) => setQuery(event.target.value)} />
      </section>

      <div className={styles.topics} role="group" aria-label="Topics">
        {topics.map((item) => (
          <button key={item.name} type="button" className={styles.topic} aria-pressed={topic === item.name} onClick={() => setTopic(topic === item.name ? null : item.name)}>
            <ToneTile tone={item.tone} size={44}>
              <item.icon />
            </ToneTile>
            <span className={styles.topicText}>
              <strong>{item.name}</strong>
              <span>{item.blurb}</span>
            </span>
          </button>
        ))}
      </div>

      <div className={styles.columns}>
        <section className={styles.faq} aria-label="Frequently asked questions">
          <header>
            <h2>{topic ?? "Popular questions"}</h2>
            <span>{shown.length} {shown.length === 1 ? "answer" : "answers"}</span>
          </header>
          {shown.length === 0 && (
            <div className={styles.empty}>
              <LuSearchX aria-hidden />
              <p>Nothing matches “{query}”.</p>
              <Button variant="secondary" size="sm" onClick={() => { setQuery(""); setTopic(null); }}>Clear search</Button>
            </div>
          )}
          <ul>
            {shown.map((item) => {
              const expanded = open === item.q;
              return (
                <li key={item.q} data-open={expanded || undefined}>
                  <button type="button" aria-expanded={expanded} onClick={() => setOpen(expanded ? null : item.q)}>
                    <span>{item.q}</span>
                    <LuChevronDown aria-hidden />
                  </button>
                  {expanded && <p>{item.a}</p>}
                </li>
              );
            })}
          </ul>
        </section>

        <aside className={styles.side}>
          <section className={styles.card}>
            <ToneTile tone="primary" size={44}>
              <LuLifeBuoy />
            </ToneTile>
            <h3>Still need a hand?</h3>
            <p>Our support team replies within one working day.</p>
            <a className="btn btn-primary btn-md" href="mailto:support@sanova.clinic">
              <LuMail aria-hidden /> Email support
            </a>
          </section>
          <section className={styles.card}>
            <h3>Keyboard shortcuts</h3>
            <ul className={styles.keys}>
              {shortcuts.map((row) => (
                <li key={row.what + row.keys.join("")}>
                  <span>{row.what}</span>
                  <span className={styles.keyset}>
                    {row.keys.map((key) => (
                      <kbd key={key} className="kbd">{key}</kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
