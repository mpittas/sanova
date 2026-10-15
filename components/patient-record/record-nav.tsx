import Link from "next/link";
import { LuClipboardList, LuClock, LuFileText, LuFlaskConical, LuImage, LuPill } from "react-icons/lu";
import styles from "./patient-record.module.css";

const items = [
  { label: "Medical History", href: "/medical-records#medical-history", icon: LuClipboardList },
  { label: "Visits", href: "/medical-records#visits", icon: LuClock },
  { label: "Prescriptions", href: "/prescriptions", icon: LuPill },
  { label: "Lab Results", href: "/lab-results", icon: LuFlaskConical },
  { label: "Imaging", href: "/medical-records#imaging", icon: LuImage },
  { label: "Documents", href: "/medical-records#documents", icon: LuFileText },
] as const;

/** Links between the sections of one patient's record. `current` is the label of the page being shown. */
export function RecordNav({ current }: { current: (typeof items)[number]["label"] }) {
  return (
    <nav aria-label="Patient record sections">
      <ul className={styles.nav}>
        {items.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <Link href={href} aria-current={label === current ? "page" : undefined}>
              <Icon aria-hidden />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
