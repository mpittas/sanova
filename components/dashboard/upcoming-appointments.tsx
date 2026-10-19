"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import {
  LuArrowRight,
  LuCircleCheck,
  LuClock,
  LuEllipsisVertical,
  LuRefreshCw,
  LuSearch,
  LuStickyNote,
  LuX,
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Counter } from "@/components/ui/counter";
import { Person } from "@/components/ui/person";
import { SearchInput } from "@/components/ui/search-input";
import { Table, Th } from "@/components/ui/table";
import { Tabs, tabId } from "@/components/ui/tabs";
import { appointments, appointmentTabs, type AppointmentStatus, type AppointmentTab } from "./data";
import styles from "./dashboard.module.css";

const PANEL_ID = "dashboard-appointments";

const statusChip: Record<AppointmentStatus, { tone: "success" | "info" | "warning"; icon: ReactNode }> = {
  "Checked In": { tone: "success", icon: <LuCircleCheck aria-hidden /> },
  Upcoming: { tone: "info", icon: <LuClock aria-hidden /> },
  Rescheduled: { tone: "warning", icon: <LuRefreshCw aria-hidden /> },
};

export function UpcomingAppointments() {
  const [tab, setTab] = useState<AppointmentTab>("All");
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () => ({
      All: appointments.length,
      "Checked In": appointments.filter(({ status }) => status === "Checked In").length,
      Upcoming: appointments.filter(({ status }) => status === "Upcoming").length,
      Rescheduled: appointments.filter(({ status }) => status === "Rescheduled").length,
    }),
    [],
  );

  const term = query.trim().toLowerCase();
  const rows = appointments.filter(
    ({ status, patient, visit, mrn }) =>
      (tab === "All" || status === tab) && (!term || `${patient} ${visit} ${mrn}`.toLowerCase().includes(term)),
  );

  return (
    <Card
      title="Upcoming appointments"
      description="Today's schedule"
      action={
        <div className={styles.cardActions}>
          <Link href="/appointments" className={`text-label ${styles.viewAll}`}>
            View all <LuArrowRight aria-hidden />
          </Link>
          <Button
            variant="ghost"
            iconOnly
            pressed={searching}
            aria-label={searching ? "Close search" : "Search appointments"}
            onClick={() => {
              setSearching((open) => !open);
              setQuery("");
            }}
          >
            {searching ? <LuX /> : <LuSearch />}
          </Button>
        </div>
      }
    >
      {searching && (
        <SearchInput
          label="Search appointments"
          placeholder="Search patient, visit or MRN..."
          wrapperClassName={styles.tableSearch}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoFocus
        />
      )}
      <Tabs
        variant="pill"
        aria-label="Appointment status"
        panelId={PANEL_ID}
        value={tab}
        options={appointmentTabs}
        counts={counts}
        onChange={setTab}
      />
      <div id={PANEL_ID} role="tabpanel" aria-labelledby={tabId(PANEL_ID, tab)}>
        <Table variant="simple" className={styles.appointments} minWidth={560}>
          <thead>
            <tr>
              <Th>Patient</Th>
              <Th>Visit</Th>
              <Th className={styles.colNote}>Note</Th>
              <Th>Time</Th>
              <Th className={styles.colFee}>Fee</Th>
              <Th>Status</Th>
              <Th className={styles.colMore}>
                <span className="sr-only">Actions</span>
              </Th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ time, period, patient, mrn, visit, department, notes, fee, status }) => (
              <tr key={`${time}-${patient}`}>
                <td>
                  <Person name={patient} subtitle={mrn} size={48} />
                </td>
                <td>
                  <span className={styles.visit}>
                    <span className={`text-label ${styles.visitTitle}`}>{visit}</span>
                    <span className="text-small text-muted">{department}</span>
                  </span>
                </td>
                <td className={styles.colNote}>
                  <span className={styles.note} role="img" aria-label={notes ? `${notes} new notes` : "No new notes"}>
                    <LuStickyNote aria-hidden />
                    {notes > 0 && (
                      <Counter size="sm" className={styles.noteBadge} aria-hidden>
                        {notes}
                      </Counter>
                    )}
                  </span>
                </td>
                <td className={`num ${styles.figure} ${styles.time}`}>
                  {time} <span>{period}</span>
                </td>
                <td className={`num ${styles.figure} ${styles.colFee}`}>${fee}</td>
                <td>
                  <Chip tone={statusChip[status].tone} icon={statusChip[status].icon}>
                    {status}
                  </Chip>
                </td>
                <td className={styles.colMore}>
                  <Button variant="ghost" size="sm" iconOnly aria-label={`More actions for ${patient}`}>
                    <LuEllipsisVertical />
                  </Button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className={styles.empty}>
                  No appointments match.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Card>
  );
}
