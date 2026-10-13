import { LuCalendar, LuDownload, LuPlus } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { doctor } from "./data";
import { TodayEyebrow } from "./today-eyebrow";
import styles from "./dashboard.module.css";

export function PageHeader() {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.pageTitle}>
        <TodayEyebrow />
        <h1 className="text-h1">
          Welcome back, Dr. {doctor.surname} <span aria-hidden>👋</span>
        </h1>
        <p className="text-body-lg text-muted">Here&apos;s your clinic overview for today.</p>
      </div>

      <div className={styles.toolbar}>
        <Button variant="secondary" iconLeft={<LuCalendar />}>
          Calendar
        </Button>
        <Button variant="secondary" iconLeft={<LuDownload />}>
          Export
        </Button>
        <Button iconLeft={<LuPlus />}>Book appointment</Button>
      </div>
    </div>
  );
}
