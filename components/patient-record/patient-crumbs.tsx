import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";
import { patient } from "./data";
import styles from "./patient-record.module.css";

/** Patients › Olivia Bennett › <current page>, shown above the page title. */
export function PatientCrumbs({ current }: { current: string }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={`text-small ${styles.crumbs}`}>
        <li>
          <Link href="/patients">Patients</Link>
        </li>
        <li>
          <LuChevronRight aria-hidden />
          <span>{patient.name}</span>
        </li>
        <li>
          <LuChevronRight aria-hidden />
          <span aria-current="page">{current}</span>
        </li>
      </ol>
    </nav>
  );
}
