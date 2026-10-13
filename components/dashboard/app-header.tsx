import Link from "next/link";
import { LuBell, LuChevronDown, LuMic, LuSearch } from "react-icons/lu";
import { LogoMark } from "@/components/logo";
import { MobileMenuButton } from "@/components/layout/mobile-menu-button";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { doctor } from "./data";
import styles from "./dashboard.module.css";

export function AppHeader() {
  return (
    <header className={styles.header}>
      <MobileMenuButton className={styles.mobileOnly} />

      <Link href="/" className={`${styles.brand} ${styles.mobileOnly}`} aria-label="Sanova dashboard">
        <LogoMark size={32} />
        <span className={styles.brandName}>Sanova</span>
      </Link>

      <div className={styles.search}>
        <LuSearch className={styles.searchIcon} aria-hidden />
        <input type="search" aria-label="Search patients and appointments" placeholder="Search patients, appointments..." />
        <button type="button" className={styles.searchMic} aria-label="Search by voice">
          <LuMic aria-hidden />
        </button>
      </div>

      <span className={styles.spacer} />

      <Button variant="secondary" iconOnly className={styles.bell} aria-label="Notifications, 1 unread">
        <LuBell />
        <span className={styles.dot} />
      </Button>

      <button type="button" className={styles.user} aria-label="Account menu">
        <Avatar name={doctor.name} size={40} />
        <span className={styles.userText}>
          <span className="text-label">{doctor.name}</span>
          <span className="text-caption text-muted">{doctor.role}</span>
        </span>
        <LuChevronDown size={16} aria-hidden />
      </button>
    </header>
  );
}
