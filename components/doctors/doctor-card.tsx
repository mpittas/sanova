"use client";

import { useState } from "react";
import { LuBriefcase, LuCalendar, LuCalendarPlus, LuHeart, LuMapPin, LuStar, LuUsers } from "react-icons/lu";
import { TODAY } from "@/components/appointments/data";
import { addDays, formatDate, formatTime } from "@/components/appointments/dates";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { ToneTile } from "@/components/ui/tone-tile";
import { specialtyTone, type Doctor } from "./data";
import styles from "./doctors.module.css";

/** "Today, 1:30 PM", "Tomorrow, 9:00 AM", or "May 16, 2024" once it is further out. */
function slotLabel({ date, time }: Doctor["next"]) {
  if (date === TODAY) return `Today, ${formatTime(time)}`;
  if (date === addDays(TODAY, 1)) return `Tomorrow, ${formatTime(time)}`;
  return formatDate(date, { month: "short", day: "numeric", year: "numeric" });
}

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const [favorite, setFavorite] = useState(false);
  const onLeave = doctor.status === "On Leave";

  return (
    <article className={styles.card} data-tone={specialtyTone[doctor.specialty]}>
      <div className={styles.top}>
        <Avatar name={doctor.name} src={doctor.photo} size={112} shape="rounded" radius={42} />
        <div className={styles.identity}>
          <Chip size="sm" tone={onLeave ? "warning" : "success"}>
            {doctor.status}
          </Chip>
          <h3 className="text-h4">{doctor.name}</h3>
          <p className="text-body text-muted">{doctor.title}</p>
          <p className={styles.rating}>
            <LuStar aria-hidden />
            {doctor.reviews > 0 ? (
              <span className="text-small num">
                <strong>{doctor.rating.toFixed(1)}</strong> <span className="text-muted">({doctor.reviews} reviews)</span>
              </span>
            ) : (
              <span className="text-small text-muted">No reviews yet</span>
            )}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          className={styles.favorite}
          pressed={favorite}
          aria-label={favorite ? `Remove ${doctor.name} from favorites` : `Add ${doctor.name} to favorites`}
          onClick={() => setFavorite((value) => !value)}
        >
          <LuHeart />
        </Button>
      </div>

      <dl className={styles.facts}>
        <div>
          <LuUsers aria-hidden />
          <dt className="sr-only">Patients</dt>
          <dd>
            <span className="text-label num">{doctor.patients}</span>
            <span className="text-caption text-muted">Patients</span>
          </dd>
        </div>
        <div>
          <LuBriefcase aria-hidden />
          <dt className="sr-only">Experience</dt>
          <dd>
            <span className="text-label num">{doctor.experience} yrs</span>
            <span className="text-caption text-muted">Experience</span>
          </dd>
        </div>
        <div>
          <LuMapPin aria-hidden />
          <dt className="sr-only">Location</dt>
          <dd>
            <span className="text-label">{doctor.location.site}</span>
            <span className="text-caption text-muted">{doctor.location.floor}</span>
          </dd>
        </div>
      </dl>

      <div className={styles.next}>
        <ToneTile tone="primary" size={40}>
          <LuCalendar />
        </ToneTile>
        <p className={styles.slot}>
          <span className="text-caption text-muted">{onLeave ? "Back on" : "Next available"}</span>
          <span className="text-label num">{slotLabel(doctor.next)}</span>
        </p>
      </div>

      <div className={styles.actions}>
        <Button>View Profile</Button>
        <Button variant="soft" href="/appointments" iconLeft={<LuCalendarPlus />}>
          Book Appointment
        </Button>
      </div>
    </article>
  );
}
