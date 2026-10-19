"use client";

import Link from "next/link";
import { LuCalendarClock, LuCalendarPlus, LuChevronRight, LuFileText, LuFlaskConical, LuMail, LuMessageSquare, LuPhone, LuPill, LuStethoscope } from "react-icons/lu";
import { formatDate, formatTime } from "@/components/appointments/dates";
import { Avatar } from "@/components/ui/avatar";
import { Chip, type ChipTone } from "@/components/ui/chip";
import { Drawer, DrawerHeader } from "@/components/ui/drawer";
import { ToneTile } from "@/components/ui/tone-tile";
import { ageOn, type Patient, type PatientStatus } from "./data";
import styles from "./patients.module.css";

const statusTone: Record<PatientStatus, ChipTone> = { Active: "success", Inactive: "neutral", "At Risk": "danger" };
const long = (iso: string) => formatDate(iso, { month: "long", day: "numeric", year: "numeric" });

const records = [
  { label: "Medical records", detail: "Visits, notes and documents", href: "/medical-records", icon: LuFileText, tone: "primary" as const },
  { label: "Prescriptions", detail: "Active and past medications", href: "/prescriptions", icon: LuPill, tone: "amber" as const },
  { label: "Lab results", detail: "Tests and key markers", href: "/lab-results", icon: LuFlaskConical, tone: "violet" as const },
];

/** A quick look at one patient from the list: who they are, when they are next seen, and where to go from here. */
export function PatientDrawer({ patient, onClose }: { patient: Patient | null; onClose: () => void }) {
  return (
    <Drawer open={Boolean(patient)} onClose={onClose} labelledBy="patient-drawer-title" width={500}>
      {patient && (
        <div className={styles.drawer}>
          <DrawerHeader
            titleId="patient-drawer-title"
            title={patient.name}
            leading={<Avatar name={patient.name} src={patient.photo} size={64} />}
            description={
              <div className={styles.drawerMeta}>
                <span className="num">MRN {patient.mrn}</span>
                <Chip tone={statusTone[patient.status]}>{patient.status}</Chip>
                {patient.isNew && <Chip tone="info">New</Chip>}
              </div>
            }
            onClose={onClose}
          />

          <div className={styles.drawerBody}>
            <div className={styles.drawerActions}>
              <Link href="/appointments" className="btn btn-primary btn-md">
                <LuCalendarPlus aria-hidden /> Book visit
              </Link>
              <Link href="/messages" className="btn btn-secondary btn-md">
                <LuMessageSquare aria-hidden /> Message
              </Link>
            </div>

            <section className={styles.next} data-empty={!patient.next || undefined} aria-label="Next appointment">
              <ToneTile tone={patient.next ? "primary" : "amber"} size={44}>
                <LuCalendarClock />
              </ToneTile>
              <div>
                <p className="text-small text-muted">Next appointment</p>
                <p className={styles.nextValue}>{patient.next ? `${long(patient.next.date)} at ${formatTime(patient.next.time)}` : "Nothing scheduled yet"}</p>
              </div>
            </section>

            <dl className={styles.facts}>
              <div>
                <dt>Date of birth</dt>
                <dd>
                  {long(patient.dob)} <span className="text-muted">({ageOn(patient.dob)} years)</span>
                </dd>
              </div>
              <div>
                <dt><LuStethoscope aria-hidden /> Provider</dt>
                <dd>{patient.provider}</dd>
              </div>
              <div>
                <dt><LuPhone aria-hidden /> Phone</dt>
                <dd><a href={`tel:${patient.phone}`}>{patient.phone}</a></dd>
              </div>
              <div>
                <dt><LuMail aria-hidden /> Email</dt>
                <dd><a href={`mailto:${patient.email}`}>{patient.email}</a></dd>
              </div>
              <div>
                <dt>Last visit</dt>
                <dd>{long(patient.lastVisit)}</dd>
              </div>
            </dl>

            <h3 className={styles.drawerHeading}>Patient file</h3>
            <ul className={styles.links}>
              {records.map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>
                    <ToneTile tone={item.tone} size={40}>
                      <item.icon />
                    </ToneTile>
                    <span>
                      <strong>{item.label}</strong>
                      <span>{item.detail}</span>
                    </span>
                    <LuChevronRight aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Drawer>
  );
}
