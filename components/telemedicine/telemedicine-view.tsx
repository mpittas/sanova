"use client";

import { useMemo, useState } from "react";
import { LuPlus, LuShieldCheck, LuVideo, LuSlidersHorizontal, LuVideoOff } from "react-icons/lu";
import { appointments, TODAY } from "@/components/appointments/data";
import { formatDate, formatTime, type ISODate } from "@/components/appointments/dates";
import { PageHeader } from "@/components/layout/page-header";
import { SplitLayout } from "@/components/layout/split-layout";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { ArchLineup, PageBanner } from "@/components/ui/page-banner";
import { portraits } from "@/lib/portraits";
import { usePagination } from "@/lib/use-pagination";
import { Notice } from "@/components/ui/notice";
import { Card } from "@/components/ui/card";
import { Counter } from "@/components/ui/counter";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar, FilterField, FilterPanel } from "@/components/ui/filter-bar";
import { FilterChips } from "@/components/ui/filter-chips";
import { NoResults } from "@/components/ui/no-results";
import { ResultsFooter } from "@/components/ui/results-footer";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { initialSessions, tabs, type CallType, type Session, type SessionTab } from "./data";
import { NewSessionModal } from "./new-session-modal";
import { QuickActions } from "./quick-actions";
import { SessionDetailsModal } from "./session-details-modal";
import { SessionRow, type SessionHandlers } from "./session-row";
import { WeekCalendar } from "./week-calendar";
import styles from "./telemedicine.module.css";

const PAGE_SIZE = 5;

const heading: Record<SessionTab, { title: string; description: string }> = {
  Upcoming: { title: "Upcoming Consultations", description: "Scheduled video and audio visits." },
  "Past Sessions": { title: "Past Sessions", description: "Completed and cancelled consultations." },
  "Instant Consult": { title: "Instant Consultations", description: "Patients waiting in the virtual waiting room." },
  Requested: { title: "Session Requests", description: "Patients asking for a virtual visit. Accept to book it." },
};

const empty: Record<SessionTab, { title: string; description: string }> = {
  Upcoming: { title: "No upcoming sessions", description: "Scheduled consultations will show up here." },
  "Past Sessions": { title: "No past sessions", description: "Finished consultations will show up here." },
  "Instant Consult": { title: "No one is waiting", description: "Patients who ask for an instant consult will appear here." },
  Requested: { title: "No pending requests", description: "You're all caught up." },
};

type SortKey = "near" | "far" | "patient";
const sortLabels = (tab: SessionTab): Record<SortKey, string> =>
  tab === "Past Sessions"
    ? { near: "Date (Most recent)", far: "Date (Oldest)", patient: "Patient (A–Z)" }
    : { near: "Date (Soonest)", far: "Date (Furthest)", patient: "Patient (A–Z)" };

const allCalls = "All calls";
const allVisits = "All visit types";
const callOptions = [allCalls, "Video Call", "Audio Call"] as const;

export function TelemedicineView() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [tab, setTab] = useState<SessionTab>("Upcoming");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("near");
  const [moreOpen, setMoreOpen] = useState(false);
  const [call, setCall] = useState<(typeof callOptions)[number]>(allCalls);
  const [visit, setVisit] = useState<string>(allVisits);

  const [newOpen, setNewOpen] = useState(false);
  const [openId, setOpenId] = useState<string>();
  const [calendarDate, setCalendarDate] = useState<ISODate>(TODAY);
  const [notice, setNotice] = useState<string | null>(null);

  const inTab = useMemo(() => sessions.filter((session) => session.tab === tab), [sessions, tab]);
  const visitOptions = useMemo(() => [allVisits, ...[...new Set(inTab.map((session) => session.title))].sort()], [inTab]);
  // A visit type that has just disappeared (its last session ended or was declined) can't stay selected.
  const activeVisit = visitOptions.includes(visit) ? visit : allVisits;
  const extraFilters = (call !== allCalls ? 1 : 0) + (activeVisit !== allVisits ? 1 : 0);
  const hasFilters = query !== "" || extraFilters > 0;

  const counts = useMemo(() => {
    const result = Object.fromEntries(tabs.map((name) => [name, 0])) as Record<SessionTab, number>;
    for (const session of sessions) result[session.tab]++;
    return result;
  }, [sessions]);

  const labels = sortLabels(tab);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matches = inTab.filter((session) => {
      if (call !== allCalls && session.callType !== (call as CallType)) return false;
      if (activeVisit !== allVisits && session.title !== activeVisit) return false;
      if (needle && ![session.patient, session.title, session.summary, session.mrn].some((field) => field.toLowerCase().includes(needle))) return false;
      return true;
    });
    const stamp = (session: Session) => `${session.date} ${session.start}`;
    // "Nearest" is the one closest to now: earliest first for what's ahead, latest first for what's done.
    const direction = (tab === "Past Sessions" ? -1 : 1) * (sort === "far" ? -1 : 1);
    return matches.sort((a, b) => (sort === "patient" ? a.patient.localeCompare(b.patient) : direction * stamp(a).localeCompare(stamp(b))));
  }, [inTab, query, call, activeVisit, sort, tab]);

  const { page, setPage, reset, totalPages, firstIndex, visible, total } = usePagination(filtered, PAGE_SIZE);

  const filter = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    reset();
  };

  const clearFilters = () => {
    setQuery("");
    setCall(allCalls);
    setVisit(allVisits);
    reset();
  };

  const changeTab = (next: SessionTab) => {
    setTab(next);
    setSort("near");
    setVisit(allVisits);
    reset();
  };

  const diary = useMemo(() => sessions.filter((session) => session.tab === "Upcoming" || session.tab === "Past Sessions"), [sessions]);
  /** Everything that already takes up time, for spotting clashes when booking. */
  const busy = useMemo(() => [...appointments.filter((item) => item.status !== "cancelled"), ...diary.filter((session) => session.status !== "cancelled")], [diary]);

  const patch = (id: string, changes: Partial<Session>) => setSessions((current) => current.map((session) => (session.id === id ? { ...session, ...changes } : session)));
  const find = (id: string) => sessions.find((session) => session.id === id);

  const handlers: SessionHandlers = {
    onOpen: setOpenId,
    onStart: (id) => {
      patch(id, { status: "in-progress" });
      setNotice(`Session with ${find(id)?.patient} started.`);
    },
    onEnd: (id) => {
      patch(id, { status: "completed", tab: "Past Sessions" });
      setNotice(`Session with ${find(id)?.patient} ended and moved to Past Sessions.`);
    },
    onAccept: (id) => {
      const session = find(id);
      if (!session) return;
      patch(id, { status: "scheduled", tab: "Upcoming", requestedAgo: undefined });
      setNotice(`Booked ${session.patient} for ${formatDate(session.date, { weekday: "short", month: "short", day: "numeric" })} at ${formatTime(session.start)}.`);
    },
    onDecline: (id) => {
      const session = find(id);
      setSessions((current) => current.filter((item) => item.id !== id));
      setNotice(`Declined the request from ${session?.patient}. They will be asked to choose another time.`);
    },
  };

  const book = (session: Session) => {
    setSessions((current) => [...current, session]);
    setTab("Upcoming");
    clearFilters();
    setCalendarDate(session.date);
    setNotice(`Booked ${session.patient} for ${formatDate(session.date, { weekday: "short", month: "short", day: "numeric" })} at ${formatTime(session.start)}.`);
  };

  return (
    <>
      <PageHeader
        title="Telemedicine"
        description="Connect with your patients through secure video and audio consultations."
        actions={
          <Button iconLeft={<LuPlus />} onClick={() => setNewOpen(true)}>
            New Teleconsultation
          </Button>
        }
      />

      <PageBanner
        title="Virtual Care, Real Impact"
        description="Connect with your patients anytime, anywhere. Provide high-quality care through secure and convenient virtual consultations."
        visual={
          <ArchLineup photos={[portraits["Olivia Torres"], portraits["Dr. James Carter"]]}>
            <span className={styles.callBadge}>
              <LuVideo />
            </span>
            <Chip tone="success" variant="tag" className={styles.secure}>
              <LuShieldCheck /> End-to-end encrypted
            </Chip>
          </ArchLineup>
        }
      />

      <SplitLayout
        sideLabel="Calendar and shortcuts"
        aside={
          <>
            <WeekCalendar selected={calendarDate} sessions={diary} onSelect={setCalendarDate} onOpen={setOpenId} />
            <QuickActions waiting={counts["Instant Consult"]} requests={counts.Requested} onInstant={() => changeTab("Instant Consult")} onRequests={() => changeTab("Requested")} />
          </>
        }
      >
        <Notice message={notice} onDismiss={() => setNotice(null)} />

        <FilterBar
          chips={
            <FilterChips
              aria-label="Session type"
              value={tab}
              options={tabs.map((value) => ({ value, count: counts[value] }))}
              onChange={changeTab}
            />
          }
        >
          <SearchInput
            label="Search sessions"
            tone="white"
            value={query}
            onChange={(event) => filter(setQuery)(event.target.value)}
            placeholder="Search patients..."
          />
          <Button
            variant="secondary"
            iconLeft={<LuSlidersHorizontal />}
            pressed={moreOpen}
            aria-expanded={moreOpen}
            aria-controls="more-session-filters"
            onClick={() => setMoreOpen((open) => !open)}
          >
            Filters
            {extraFilters > 0 && <Counter>{extraFilters}</Counter>}
          </Button>
          <Select
            size="md"
            aria-label="Sort sessions"
            value={labels[sort]}
            options={Object.values(labels)}
            onChange={(label) => {
              setSort((Object.keys(labels) as SortKey[]).find((key) => labels[key] === label) ?? "near");
              reset();
            }}
          />
        </FilterBar>

        {moreOpen && (
          <FilterPanel id="more-session-filters" onReset={clearFilters} canReset={hasFilters}>
            <FilterField label="Call type">
              <Select size="md" aria-label="Filter by call type" value={call} options={callOptions} onChange={filter(setCall)} />
            </FilterField>
            <FilterField label="Visit type">
              <Select size="md" aria-label="Filter by visit type" value={activeVisit} options={visitOptions} onChange={filter(setVisit)} />
            </FilterField>
          </FilterPanel>
        )}

        <Card rounded className={styles.list} title={heading[tab].title} description={heading[tab].description}>
          {visible.length > 0 ? (
            <ul className={styles.rows} aria-label={heading[tab].title}>
              {visible.map((session) => (
                <SessionRow key={session.id} session={session} handlers={handlers} />
              ))}
            </ul>
          ) : hasFilters && inTab.length > 0 ? (
            <NoResults title="No sessions found" onClear={clearFilters} />
          ) : (
            <EmptyState
              icon={LuVideoOff}
              title={empty[tab].title}
              description={empty[tab].description}
              action={
                tab === "Upcoming" ? (
                  <Button size="sm" iconLeft={<LuPlus />} onClick={() => setNewOpen(true)}>
                    New Teleconsultation
                  </Button>
                ) : undefined
              }
            />
          )}
        </Card>

        <ResultsFooter
          firstIndex={firstIndex}
          shown={visible.length}
          total={total}
          noun={["session", "sessions"]}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </SplitLayout>

      <NewSessionModal open={newOpen} onClose={() => setNewOpen(false)} onBook={book} busy={busy} />
      <SessionDetailsModal session={openId ? find(openId) : undefined} handlers={handlers} onClose={() => setOpenId(undefined)} />
    </>
  );
}
