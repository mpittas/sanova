"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuBell, LuCalendarCheck, LuChevronDown, LuCircleHelp, LuCommand, LuFlaskConical, LuMessageSquare, LuPill, LuReceipt, LuSearch, LuSettings, LuCheckCheck } from "react-icons/lu";
import type { IconType } from "react-icons";
import { doctor } from "@/components/dashboard/data";
import styles from "@/components/dashboard/dashboard.module.css";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";
import { Segmented } from "@/components/ui/segmented";
import { ToneTile, type Tone } from "@/components/ui/tone-tile";
import { CommandPalette } from "./command-palette";

/** The search field in the top bar. It opens the ⌘K command menu, which also answers Ctrl/⌘+K and "/" from anywhere. */
export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const [mac, setMac] = useState(true);

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/i.test(navigator.platform));
    const onKey = (event: KeyboardEvent) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test((event.target as HTMLElement)?.tagName ?? "") || (event.target as HTMLElement)?.isContentEditable;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      } else if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button type="button" className={`search-trigger ${styles.search}`} onClick={() => setOpen(true)} aria-label="Search patients, doctors and pages" aria-keyshortcuts="Control+K Meta+K">
        <LuSearch aria-hidden />
        <span>Search patients, appointments…</span>
        <span className="search-trigger-keys" aria-hidden>
          {mac ? <LuCommand /> : <span>Ctrl</span>}
          <span>K</span>
        </span>
      </button>
      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </>
  );
}

type Notification = { id: string; icon: IconType; tone: Tone; text: React.ReactNode; time: string; href: string; unread: boolean };

const initial: Notification[] = [
  { id: "n1", icon: LuFlaskConical, tone: "violet", text: <><strong>Lab results ready</strong> for Olivia Bennett: complete blood count is within range.</>, time: "8 min ago", href: "/lab-results", unread: true },
  { id: "n2", icon: LuMessageSquare, tone: "blue", text: <><strong>Emily Carter</strong> replied: “Thank you! That works for me.”</>, time: "42 min ago", href: "/messages", unread: true },
  { id: "n3", icon: LuCalendarCheck, tone: "primary", text: <><strong>Mia Wong</strong> checked in for her 11:00 AM visit.</>, time: "1 hour ago", href: "/appointments", unread: true },
  { id: "n4", icon: LuReceipt, tone: "coral", text: <><strong>Invoice INV-1046</strong> for Sophia Nguyen is 1 day overdue.</>, time: "3 hours ago", href: "/billing", unread: false },
  { id: "n5", icon: LuPill, tone: "amber", text: <><strong>Refill requested</strong> for Albuterol Inhaler by Olivia Bennett.</>, time: "Yesterday", href: "/prescriptions", unread: false },
];

/** Bell with a panel of recent activity: unread items are highlighted and can be cleared in one go. */
export function NotificationsMenu() {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [tab, setTab] = useState<"All" | "Unread">("All");
  const unread = items.filter((item) => item.unread).length;
  const shown = tab === "All" ? items : items.filter((item) => item.unread);

  return (
    <Popover
      label="Notifications"
      width={400}
      trigger={({ open: _open, ...props }) => (
        <Button variant="secondary" iconOnly className={styles.bell} aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"} {...props}>
          <LuBell />
          {unread > 0 && <span className={styles.dot} />}
        </Button>
      )}
    >
      {(close) => (
        <>
          <div className="popover-head">
            <p className="popover-title">Notifications {unread > 0 && <span className="popover-count">{unread}</span>}</p>
            <button type="button" className="popover-link" onClick={() => setItems((list) => list.map((item) => ({ ...item, unread: false })))} disabled={unread === 0}>
              <LuCheckCheck aria-hidden /> Mark all as read
            </button>
          </div>
          <div className="popover-tabs">
            <Segmented aria-label="Show notifications" value={tab} options={["All", "Unread"] as const} onChange={setTab} />
          </div>
          <ul className="notif-list">
            {shown.length === 0 && <li className="notif-empty">You're all caught up.</li>}
            {shown.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="notif"
                  data-unread={item.unread || undefined}
                  onClick={() => {
                    setItems((list) => list.map((entry) => (entry.id === item.id ? { ...entry, unread: false } : entry)));
                    close();
                    router.push(item.href);
                  }}
                >
                  <ToneTile tone={item.tone} size={40}>
                    <item.icon />
                  </ToneTile>
                  <span className="notif-body">
                    <span className="notif-text">{item.text}</span>
                    <span className="notif-time">{item.time}</span>
                  </span>
                  {item.unread && <span className="notif-dot" aria-label="Unread" />}
                </button>
              </li>
            ))}
          </ul>
          <div className="popover-footer">
            <Link href="/messages" className="menu-item" onClick={close}>
              <LuMessageSquare aria-hidden /> Open messages
            </Link>
          </div>
        </>
      )}
    </Popover>
  );
}

/** The account button: a small menu with the quick links people look for there. */
export function AccountMenu() {
  return (
    <Popover
      label="Account"
      width={288}
      trigger={({ open: _open, ...props }) => (
        <button type="button" className={styles.user} aria-label="Account menu" {...props}>
          <Avatar name={doctor.name} size={40} />
          <span className={styles.userText}>
            <span className="text-label">{doctor.name}</span>
            <span className="text-caption text-muted">{doctor.role}</span>
          </span>
          <LuChevronDown size={16} aria-hidden />
        </button>
      )}
    >
      {(close) => (
        <>
          <div className="menu-profile">
            <Avatar name={doctor.name} size={44} />
            <span className="text-stack">
              <span className="text-label">{doctor.name}</span>
              <span className="text-small text-muted">james.carter@sanova.clinic</span>
            </span>
          </div>
          <div className="menu-list">
            <Link href="/settings" className="menu-item" onClick={close}>
              <LuSettings aria-hidden /> Settings
            </Link>
            <Link href="/help" className="menu-item" onClick={close}>
              <LuCircleHelp aria-hidden /> Help Center
            </Link>
            <button
              type="button"
              className="menu-item"
              onClick={() => {
                close();
                document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));
              }}
            >
              <LuSearch aria-hidden /> Command menu <kbd className="kbd menu-kbd">Ctrl K</kbd>
            </button>
          </div>
        </>
      )}
    </Popover>
  );
}
