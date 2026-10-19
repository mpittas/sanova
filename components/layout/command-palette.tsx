"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { IconType } from "react-icons";
import {
  LuBuilding2,
  LuCalendarDays,
  LuCalendarPlus,
  LuChartColumn,
  LuCornerDownLeft,
  LuFileText,
  LuFlaskConical,
  LuLayoutDashboard,
  LuMessageSquare,
  LuPill,
  LuReceipt,
  LuSearch,
  LuSettings,
  LuStethoscope,
  LuUserPlus,
  LuUsers,
  LuVideo,
  LuCircleHelp,
} from "react-icons/lu";
import { doctors } from "@/components/doctors/data";
import { patients } from "@/components/patients/data";
import { Avatar } from "@/components/ui/avatar";

type Item = { id: string; group: string; label: string; sub?: string; href: string; icon?: IconType; photo?: { name: string; src: string }; keywords?: string };

const actions: Item[] = [
  { id: "a-book", group: "Quick actions", label: "Book an appointment", sub: "Schedule a visit for a patient", href: "/appointments", icon: LuCalendarPlus, keywords: "new schedule visit" },
  { id: "a-patient", group: "Quick actions", label: "Add a patient", sub: "Create a new patient record", href: "/patients", icon: LuUserPlus, keywords: "new register" },
  { id: "a-invoice", group: "Quick actions", label: "Create an invoice", sub: "Bill a patient or insurer", href: "/billing", icon: LuReceipt, keywords: "new bill payment" },
  { id: "a-rx", group: "Quick actions", label: "Write a prescription", sub: "Send a new medication order", href: "/prescriptions", icon: LuPill, keywords: "new medication" },
  { id: "a-call", group: "Quick actions", label: "Start a teleconsultation", sub: "Open a secure video visit", href: "/telemedicine", icon: LuVideo, keywords: "video call remote" },
];

const pages: Item[] = [
  { id: "p-dash", group: "Pages", label: "Dashboard", href: "/", icon: LuLayoutDashboard },
  { id: "p-appt", group: "Pages", label: "Appointments", href: "/appointments", icon: LuCalendarDays },
  { id: "p-pat", group: "Pages", label: "Patients", href: "/patients", icon: LuUsers },
  { id: "p-doc", group: "Pages", label: "Doctors", href: "/doctors", icon: LuStethoscope },
  { id: "p-dep", group: "Pages", label: "Departments", href: "/departments", icon: LuBuilding2 },
  { id: "p-rec", group: "Pages", label: "Medical Records", href: "/medical-records", icon: LuFileText },
  { id: "p-rx", group: "Pages", label: "Prescriptions", href: "/prescriptions", icon: LuPill },
  { id: "p-lab", group: "Pages", label: "Lab Results", href: "/lab-results", icon: LuFlaskConical },
  { id: "p-tele", group: "Pages", label: "Telemedicine", href: "/telemedicine", icon: LuVideo },
  { id: "p-bill", group: "Pages", label: "Billing", href: "/billing", icon: LuReceipt },
  { id: "p-rep", group: "Pages", label: "Reports", href: "/reports", icon: LuChartColumn },
  { id: "p-msg", group: "Pages", label: "Messages", href: "/messages", icon: LuMessageSquare },
  { id: "p-set", group: "Pages", label: "Settings", href: "/settings", icon: LuSettings },
  { id: "p-help", group: "Pages", label: "Help Center", href: "/help", icon: LuCircleHelp },
];

const people: Item[] = [
  ...patients.slice(0, 40).map((patient) => ({ id: `pt-${patient.id}`, group: "Patients", label: patient.name, sub: `${patient.mrn} · ${patient.provider}`, href: "/patients", photo: { name: patient.name, src: patient.photo }, keywords: patient.email })),
  ...doctors.map((doctor) => ({ id: `dr-${doctor.id}`, group: "Doctors", label: doctor.name, sub: doctor.specialty, href: "/doctors", photo: { name: doctor.name, src: doctor.photo } })),
];

const matches = (item: Item, query: string) => `${item.label} ${item.sub ?? ""} ${item.keywords ?? ""}`.toLowerCase().includes(query);

/** ⌘K command palette: jump to a page, a patient or a doctor, or start a common task, all from the keyboard. */
export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [...actions, ...pages.slice(0, 6)];
    return [...actions.filter((i) => matches(i, needle)), ...pages.filter((i) => matches(i, needle)), ...people.filter((i) => matches(i, needle)).slice(0, 8)];
  }, [query]);

  const groups = useMemo(() => {
    const order: string[] = [];
    const byGroup = new Map<string, Item[]>();
    results.forEach((item) => {
      if (!byGroup.has(item.group)) {
        byGroup.set(item.group, []);
        order.push(item.group);
      }
      byGroup.get(item.group)!.push(item);
    });
    return order.map((name) => ({ name, items: byGroup.get(name)! }));
  }, [results]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>("[data-active]")?.scrollIntoView({ block: "nearest" });
  }, [active, results]);

  const go = (item: Item | undefined) => {
    if (!item) return;
    onClose();
    router.push(item.href);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(results[active]);
    }
  };

  let flat = -1;
  return (
    <dialog
      ref={ref}
      className="palette"
      aria-label="Command menu"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={() => {
        setQuery("");
        setActive(0);
      }}
      onMouseDown={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      {open && (
        <div onKeyDown={onKeyDown}>
          <div className="palette-search">
            <LuSearch aria-hidden />
            <input
              autoFocus
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              placeholder="Search patients, doctors, pages or actions…"
              aria-label="Search"
            />
            <kbd className="kbd">Esc</kbd>
          </div>
          <div className="palette-list" ref={listRef} role="listbox" aria-label="Results">
            {groups.length === 0 && (
              <p className="palette-empty">
                No results for “{query}”.
                <br />
                <span className="text-small">Try a patient name, a page or an action.</span>
              </p>
            )}
            {groups.map((group) => (
              <div key={group.name} className="palette-group">
                <p className="palette-label">{group.name}</p>
                {group.items.map((item) => {
                  flat += 1;
                  const index = flat;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="option"
                      aria-selected={index === active}
                      className="palette-item"
                      data-active={index === active || undefined}
                      onMouseMove={() => setActive(index)}
                      onClick={() => go(item)}
                    >
                      {item.photo ? <Avatar name={item.photo.name} src={item.photo.src} size={32} /> : <span className="palette-icon">{Icon && <Icon aria-hidden />}</span>}
                      <span className="palette-item-main">
                        <span className="palette-item-title">{item.label}</span>
                        {item.sub && <span className="palette-item-sub">{item.sub}</span>}
                      </span>
                      {index === active && <LuCornerDownLeft className="palette-enter" aria-hidden />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="palette-foot" aria-hidden>
            <span><kbd className="kbd">↑</kbd><kbd className="kbd">↓</kbd> Navigate</span>
            <span><kbd className="kbd">↵</kbd> Open</span>
            <span><kbd className="kbd">Esc</kbd> Close</span>
          </div>
        </div>
      )}
    </dialog>
  );
}
