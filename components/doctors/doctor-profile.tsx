"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { LuCalendarClock, LuChevronRight, LuClock, LuLanguages, LuMapPin, LuPhone, LuStar } from "react-icons/lu";
import { TODAY } from "@/components/appointments/data";
import { formatDate, formatTime } from "@/components/appointments/dates";
import { PageHeader } from "@/components/layout/page-header";
import { SplitLayout } from "@/components/layout/split-layout";
import { Avatar } from "@/components/ui/avatar";
import { BookAppointmentButton } from "@/components/booking/book-appointment-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { DetailItem, DetailList } from "@/components/ui/detail-list";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Tabs, tabId } from "@/components/ui/tabs";
import type { Doctor } from "./data";
import { buildProfile } from "./profile-data";
import { slotLabel } from "./slot-label";
import styles from "./doctor-profile.module.css";

const tabs = ["Overview", "Availability", "Reviews"] as const;
type ProfileTab = (typeof tabs)[number];

function Stars({ value }: { value: number }) {
  return (
    <span className={styles.stars} role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <LuStar key={star} aria-hidden data-on={value >= star - 0.25 || undefined} />
      ))}
    </span>
  );
}

export function DoctorProfile({ doctor }: { doctor: Doctor }) {
  const profile = useMemo(() => buildProfile(doctor), [doctor]);
  const panelId = useId();
  const [tab, setTab] = useState<ProfileTab>("Overview");
  const [day, setDay] = useState(() => profile.days.find((entry) => entry.times.length > 0)?.date ?? profile.days[0].date);
  const [time, setTime] = useState<string | null>(null);

  const onLeave = doctor.status === "On Leave";
  const selectedDay = profile.days.find((entry) => entry.date === day) ?? profile.days[0];
  const total = profile.distribution.reduce((sum, row) => sum + row.share, 0);

  return (
    <>
      <PageHeader
        eyebrow={
          <nav aria-label="Breadcrumb">
            <ol className={`text-small ${styles.crumbs}`}>
              <li>
                <Link href="/doctors">Doctors</Link>
              </li>
              <li>
                <LuChevronRight aria-hidden />
                <span aria-current="page">{doctor.name}</span>
              </li>
            </ol>
          </nav>
        }
        title="Doctor profile"
        actions={
          <>
            <Button variant="secondary" href="/messages">
              Message
            </Button>
            {onLeave ? <Button disabled>Book visit</Button> : <BookAppointmentButton prefill={{ doctorId: doctor.id }}>Book visit</BookAppointmentButton>}
          </>
        }
      />

      {/* The one expressive element: the same emerald hero as the team banner, with nothing extra on it. */}
      <section className={styles.hero} aria-label={doctor.name}>
        <div className={styles.heroMain}>
          <Avatar name={doctor.name} src={doctor.photo} size={96} shape="rounded" radius={24} />
          <div className={styles.heroText}>
            <h2>{doctor.name}</h2>
            <p>{doctor.title}</p>
            <p className={styles.heroStatus} data-leave={onLeave || undefined}>
              {onLeave ? "On leave" : "Accepting new patients"}
            </p>
          </div>
        </div>

        <dl className={styles.heroFacts}>
          <div>
            <dt>Patients</dt>
            <dd>{doctor.patients}</dd>
          </div>
          <div>
            <dt>Experience</dt>
            <dd>{doctor.experience} yrs</dd>
          </div>
          <div>
            <dt>Rating</dt>
            <dd>{doctor.reviews > 0 ? doctor.rating.toFixed(1) : "–"}</dd>
          </div>
        </dl>
      </section>

      <SplitLayout
        side="sm"
        aside={
          <>
            <Card rounded title="Details">
              <DetailList>
                <DetailItem icon={LuCalendarClock} title={onLeave ? "Returns" : "Next available"}>
                  {slotLabel(doctor.next)}
                </DetailItem>
                <DetailItem icon={LuMapPin} title="Location">
                  {doctor.location.site}, {doctor.location.floor}
                </DetailItem>
                <DetailItem icon={LuPhone} title="Contact">
                  <a href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}>{profile.phone}</a>
                  <br />
                  <a href={`mailto:${profile.email}`} className={styles.wrap}>
                    {profile.email}
                  </a>
                </DetailItem>
                <DetailItem icon={LuLanguages} title="Languages">
                  {profile.languages.join(", ")}
                </DetailItem>
                <DetailItem icon={LuClock} title="Hours">
                  Mon–Fri 8:30 AM – 5:00 PM
                  <br />
                  Sat 8:30 AM – 12:30 PM
                </DetailItem>
              </DetailList>
            </Card>

            <Card rounded title="Today" description={formatDate(TODAY, { weekday: "long", month: "long", day: "numeric" })}>
              {profile.today.length > 0 ? (
                <ol className={styles.timeline}>
                  {profile.today.map((visit) => (
                    <li key={visit.id} data-state={visit.state}>
                      <span className={styles.timelineTime}>{formatTime(visit.time)}</span>
                      <span className={styles.timelineDot} aria-hidden />
                      <span className={styles.timelineBody}>
                        <strong>{visit.patient}</strong>
                        <span className="text-small text-muted">{visit.visit}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-small text-muted">{onLeave ? "On leave. No visits are scheduled." : "No visits scheduled."}</p>
              )}
            </Card>
          </>
        }
      >
        <Card rounded padding="none" className={styles.workspace}>
          <Tabs aria-label="Profile sections" value={tab} options={tabs} onChange={setTab} panelId={panelId} />

          <div id={panelId} role="tabpanel" aria-labelledby={tabId(panelId, tab)} className={styles.panel}>
            {tab === "Overview" && (
              <>
                <section>
                  <h3 className={styles.heading}>About</h3>
                  <p className={styles.about}>{profile.about}</p>
                </section>

                <section>
                  <h3 className={styles.heading}>Areas of focus</h3>
                  <ul className={styles.chips}>
                    {profile.focus.map((item) => (
                      <li key={item}>
                        <Chip variant="tag">{item}</Chip>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className={styles.heading}>Education &amp; training</h3>
                  <ul className={styles.credentials}>
                    {profile.training.map((item) => (
                      <li key={item.title}>
                        <span>
                          <strong>{item.title}</strong>
                          <span className="text-small text-muted">{item.place}</span>
                        </span>
                        <span className={styles.credentialYear}>{item.year}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            )}

            {tab === "Availability" && (
              <>
                <section>
                  <h3 className={styles.heading}>Choose a day</h3>
                  <div className={styles.days} role="group" aria-label="Day">
                    {profile.days.map((entry) => (
                      <button
                        key={entry.date}
                        type="button"
                        className={styles.day}
                        aria-pressed={entry.date === selectedDay.date}
                        disabled={entry.times.length === 0}
                        onClick={() => {
                          setDay(entry.date);
                          setTime(null);
                        }}
                      >
                        <span>{formatDate(entry.date, { weekday: "short" })}</span>
                        <strong>{formatDate(entry.date, { day: "numeric" })}</strong>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className={styles.heading}>Choose a time</h3>
                  {selectedDay.times.length > 0 ? (
                    <div className={styles.slots} role="group" aria-label="Time">
                      {selectedDay.times.map((slot) => (
                        <button key={slot} type="button" aria-pressed={slot === time} onClick={() => setTime(slot)}>
                          {formatTime(slot)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-small text-muted">{onLeave ? `On leave until ${slotLabel(doctor.next)}.` : "No openings on this day."}</p>
                  )}
                </section>

                <div className={styles.bookBar}>
                  <p className="text-small text-muted">
                    {time ? (
                      <>
                        <strong>{formatDate(selectedDay.date, { weekday: "short", month: "short", day: "numeric" })}, {formatTime(time)}</strong>
                      </>
                    ) : (
                      "Select a time to book."
                    )}
                  </p>
                  {time ? (
                    <BookAppointmentButton prefill={{ doctorId: doctor.id, date: selectedDay.date, time }}>Book visit</BookAppointmentButton>
                  ) : (
                    <Button disabled>Book visit</Button>
                  )}
                </div>
              </>
            )}

            {tab === "Reviews" && (
              <>
                <section className={styles.summary}>
                  <div className={styles.score}>
                    <strong>{doctor.reviews > 0 ? doctor.rating.toFixed(1) : "–"}</strong>
                    <span className="text-small text-muted">{doctor.reviews} reviews</span>
                  </div>
                  <ul className={styles.bars} aria-label="Rating breakdown">
                    {profile.distribution.map((row) => (
                      <li key={row.stars}>
                        <span className="text-small">{row.stars}</span>
                        <ProgressBar value={(row.share / total) * 100} tone="amber" size="sm" aria-label={`${row.stars} stars`} aria-valuetext={`${row.share}%`} />
                        <span className="text-small text-muted">{row.share}%</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className={styles.heading}>Recent feedback</h3>
                  <ul className={styles.reviews}>
                    {profile.reviews.map((review) => (
                      <li key={review.id}>
                        <div className={styles.reviewTop}>
                          <strong>{review.patient}</strong>
                          <Stars value={review.rating} />
                          <span className="text-small text-muted">{formatDate(review.when, { month: "short", day: "numeric", year: "numeric" })}</span>
                        </div>
                        <p>{review.text}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            )}
          </div>
        </Card>
      </SplitLayout>
    </>
  );
}
