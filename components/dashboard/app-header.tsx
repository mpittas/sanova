import Link from "next/link";
import { LuBell, LuChevronDown, LuMic } from "react-icons/lu";
import { LogoMark } from "@/components/logo";
import { MobileMenuButton } from "@/components/layout/mobile-menu-button";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { doctor } from "./data";
import styles from "./dashboard.module.css";

export function AppHeader() {
  return (
    <header className={styles.header}>
      <MobileMenuButton className={styles.mobileOnly} />

      <Link href="/" className={`${styles.brand} ${styles.mobileOnly}`} aria-label="Sanova dashboard">
        <LogoMark size={40} />
        <span className={styles.brandName}>Sanova</span>
      </Link>

      <SearchInput
        label="Search patients and appointments"
        placeholder="Search patients, appointments..."
        wrapperClassName={styles.search}
        trailing={
          <Button variant="ghost" size="sm" iconOnly aria-label="Search by voice">
            <LuMic />
          </Button>
        }
      />

      <span className="spacer" />

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
