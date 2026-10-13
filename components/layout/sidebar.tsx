"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type SyntheticEvent } from "react";
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
      { label: "Doctors", icon: LuStethoscope },
      { label: "Departments", icon: LuBuilding2 },
    ],
  },
  {
    label: "Clinical",
    items: [
      { label: "Medical Records", icon: LuFileText },
      { label: "Prescriptions", icon: LuPill },
      { label: "Lab Results", icon: LuFlaskConical },
      { label: "Telemedicine", icon: LuVideo },
    ],
  },
  {
    label: "Manage",
    items: [
      { label: "Billing", icon: LuReceipt },
      { label: "Reports", icon: LuChartColumn },
      { label: "Messages", icon: LuMessageSquare, href: "/messages", badge: 3 },
      { label: "Settings", icon: LuSettings },
    ],
  },
];

const footerItems: NavEntry[] = [
  { label: "Design System", icon: LuPalette, href: "/docs" },
  { label: "Help Center", icon: LuCircleHelp },
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
  const [tip, setTip] = useState<{ top: number; left: number } | null>(null);

  const showTip = (event: SyntheticEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTip({ top: rect.top + rect.height / 2, left: rect.right + 12 });
  };
  const hideTip = () => setTip(null);

  const shared = {
    className: styles.item,
    "aria-current": active ? ("page" as const) : undefined,
    "aria-label": collapsed ? label : undefined,
    "data-active": active || undefined,
    onMouseEnter: showTip,
    onMouseLeave: hideTip,
    onFocus: showTip,
    onBlur: hideTip,
  };

  const content = (
    <>
      <Icon className={styles.icon} aria-hidden />
      <span className={styles.label}>{label}</span>
      {badge !== undefined && <span className={styles.badge}>{badge}</span>}
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
            <LogoMark size={36} />
            <span className={styles.brandText}>
              <span className={styles.brandName}>Sanova</span>
              <span className={styles.brandSub}>Clinic Management</span>
            </span>
          </Link>
          <button type="button" className={styles.closeBtn} onClick={closeMobile} aria-label="Close menu">
            <LuX aria-hidden />
          </button>
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
                    active={entry.href === pathname}
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
