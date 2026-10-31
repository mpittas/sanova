"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type SyntheticEvent } from "react";
import type { IconType } from "react-icons";
import {
  LuBuilding2,
  LuCalendarDays,
  LuChartColumn,
  LuChevronLeft,
  LuChevronRight,
  LuCircleHelp,
  LuFileText,
  LuFlaskConical,
  LuLayoutDashboard,
  LuLogOut,
  LuMessageSquare,
  LuPalette,
  LuPill,
  LuReceipt,
  LuSettings,
  LuStethoscope,
  LuUsers,
  LuVideo,
  LuX,
} from "react-icons/lu";
import { LogoMark } from "@/components/logo";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Counter } from "@/components/ui/counter";
import { doctor } from "@/components/dashboard/data";
import { useSidebar } from "./sidebar-context";
import styles from "./sidebar.module.css";

type NavEntry = { label: string; icon: IconType; href?: string; badge?: number };

const sections: { label: string; items: NavEntry[] }[] = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", icon: LuLayoutDashboard, href: "/" },
      { label: "Appointments", icon: LuCalendarDays, href: "/appointments", badge: 28 },
      { label: "Patients", icon: LuUsers, href: "/patients" },
      { label: "Doctors", icon: LuStethoscope, href: "/doctors" },
      { label: "Departments", icon: LuBuilding2, href: "/departments" },
    ],
  },
  {
    label: "Clinical",
    items: [
      { label: "Medical Records", icon: LuFileText, href: "/medical-records" },
      { label: "Prescriptions", icon: LuPill, href: "/prescriptions" },
      { label: "Lab Results", icon: LuFlaskConical, href: "/lab-results" },
      { label: "Telemedicine", icon: LuVideo, href: "/telemedicine" },
    ],
  },
  {
    label: "Manage",
    items: [
      { label: "Billing", icon: LuReceipt, href: "/billing" },
      { label: "Reports", icon: LuChartColumn, href: "/reports" },
      { label: "Messages", icon: LuMessageSquare, href: "/messages", badge: 3 },
      { label: "Settings", icon: LuSettings, href: "/settings" },
    ],
  },
];

const footerItems: NavEntry[] = [
  { label: "Design System", icon: LuPalette, href: "/docs" },
  { label: "Help Center", icon: LuCircleHelp, href: "/help" },
];

function NavItem({
  entry,
  active,
  collapsed,
  onNavigate,
}: {
  entry: NavEntry;
  active: boolean;
  collapsed: boolean;
  onNavigate: () => void;
}) {
  const { label, icon: Icon, href, badge } = entry;
  const [tip, setTip] = useState<{ top: number; left: number; source: "pointer" | "focus"; item: HTMLElement } | null>(null);

  // The rail opening or closing moves the items without any mouse event, so a tip from before is not shown again later.
  const [wasCollapsed, setWasCollapsed] = useState(collapsed);
  if (wasCollapsed !== collapsed) {
    setWasCollapsed(collapsed);
    setTip(null);
  }

  const showTip = (source: "pointer" | "focus") => (event: SyntheticEvent<HTMLElement>) => {
    // Touch has no hover: a tap would leave the tip stuck, since no pointer ever leaves. Keyboard focus only counts when it is visible focus, not the focus a click leaves behind.
    if (source === "pointer" && (event as unknown as PointerEvent).pointerType !== "mouse") return;
    if (source === "focus" && !event.currentTarget.matches(":focus-visible")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setTip({ top: rect.top + rect.height / 2, left: rect.right + 12, source, item: event.currentTarget });
  };
  const hideTip = () => setTip(null);

  // Safety net while a tip is up: it can miss a "leave" (the item moved or scrolled under a still pointer, the window lost
  // focus), and a fixed tip would then hang on screen. Any of these takes it down.
  const source = tip?.source;
  const item = tip?.item;
  useEffect(() => {
    if (!source) return;
    const hide = () => setTip(null);
    const onMove = (event: PointerEvent) => {
      if (source === "pointer" && !item?.contains(event.target as Node)) hide();
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && hide();
    document.addEventListener("pointermove", onMove);
    document.addEventListener("scroll", hide, true);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", hide);
    window.addEventListener("blur", hide);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("scroll", hide, true);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", hide);
      window.removeEventListener("blur", hide);
    };
  }, [source, item]);

  const shared = {
    className: styles.item,
    "aria-current": active ? ("page" as const) : undefined,
    "aria-label": collapsed ? label : undefined,
    "data-active": active || undefined,
    onPointerEnter: showTip("pointer"),
    onPointerLeave: hideTip,
    onPointerCancel: hideTip,
    onPointerDown: hideTip,
    onFocus: showTip("focus"),
    onBlur: hideTip,
  };

  const content = (
    <>
      <Icon className={styles.icon} aria-hidden />
      <span className={styles.label}>{label}</span>
      {badge !== undefined && (
        <Counter tone="soft" className={styles.badge}>
          {badge}
        </Counter>
      )}
    </>
  );

  return (
    <li>
      {href ? (
        <Link href={href} onClick={onNavigate} {...shared}>
          {content}
        </Link>
      ) : (
        <button type="button" {...shared}>
          {content}
        </button>
      )}
      {collapsed && tip && (
        <span className={styles.tooltip} role="tooltip" style={{ top: tip.top, left: tip.left }}>
          {label}
          {badge !== undefined && <span className={styles.tooltipBadge}>{badge}</span>}
        </span>
      )}
    </li>
  );
}

export function Sidebar() {
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useSidebar();
  const pathname = usePathname();
  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <div className={styles.backdrop} data-open={mobileOpen || undefined} onClick={closeMobile} aria-hidden />

      <aside
        id="app-sidebar"
        className={styles.sidebar}
        data-collapsed={collapsed || undefined}
        data-mobile-open={mobileOpen || undefined}
        aria-label="Sidebar"
      >
        <button
          type="button"
          className={styles.edgeToggle}
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          aria-controls="app-sidebar"
        >
          {collapsed ? <LuChevronRight aria-hidden /> : <LuChevronLeft aria-hidden />}
        </button>

        <div className={styles.top}>
          <Link href="/" className={styles.brand} aria-label="Sanova dashboard" onClick={closeMobile}>
            <LogoMark size={30} color="#2B2B2A" />
            <span className={styles.brandText}>
              <span className={styles.brandName}>Sanova</span>
              <span className={styles.brandSub}>Clinic Management</span>
            </span>
          </Link>
          <Button variant="ghost" size="sm" iconOnly className={styles.closeBtn} onClick={closeMobile} aria-label="Close menu">
            <LuX />
          </Button>
        </div>

        <nav className={styles.nav} aria-label="Primary">
          {sections.map((section) => (
            <div key={section.label} className={styles.section}>
              <p className={styles.sectionLabel}>
                <span>{section.label}</span>
              </p>
              <ul className={styles.list}>
                {section.items.map((entry) => (
                  <NavItem
                    key={entry.label}
                    entry={entry}
                    active={!!entry.href && (entry.href === pathname || (entry.href !== "/" && pathname.startsWith(`${entry.href}/`)))}
                    collapsed={collapsed}
                    onNavigate={closeMobile}
                  />
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={styles.bottom}>
          <ul className={styles.list}>
            {footerItems.map((entry) => (
              <NavItem
                key={entry.label}
                entry={entry}
                active={entry.href === pathname}
                collapsed={collapsed}
                onNavigate={closeMobile}
              />
            ))}
          </ul>

          <div className={styles.profile}>
            <Avatar name={doctor.name} size={38} />
            <span className={styles.profileText}>
              <span className={styles.profileName}>{doctor.name}</span>
              <span className={styles.profileRole}>{doctor.role}</span>
            </span>
            <button type="button" className={styles.logout} aria-label="Log out" title="Log out">
              <LuLogOut aria-hidden />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
