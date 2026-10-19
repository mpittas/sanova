import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { AccountMenu, HeaderSearch, NotificationsMenu } from "@/components/layout/header-actions";
import { MobileMenuButton } from "@/components/layout/mobile-menu-button";
import styles from "./dashboard.module.css";

export function AppHeader() {
  return (
    <header className={styles.header}>
      <MobileMenuButton className={styles.mobileOnly} />

      <Link href="/" className={`${styles.brand} ${styles.mobileOnly}`} aria-label="Sanova dashboard">
        <LogoMark size={40} />
        <span className={styles.brandName}>Sanova</span>
      </Link>

      <HeaderSearch />

      <span className="spacer" />

      <NotificationsMenu />
      <AccountMenu />
    </header>
  );
}
