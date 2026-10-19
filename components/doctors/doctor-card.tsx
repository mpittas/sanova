"use client";

import { useId, useState } from "react";
import { LuArrowUpRight, LuClock, LuHeart, LuStar } from "react-icons/lu";
import { TODAY } from "@/components/appointments/data";
import { addDays, formatDate, formatTime } from "@/components/appointments/dates";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalPanel } from "@/components/ui/modal";
import { type Doctor } from "./data";
import styles from "./doctors.module.css";

/** "Today, 1:30 PM", "Tomorrow, 9:00 AM", or "May 16, 2024" once it is further out. */
function slotLabel({ date, time }: Doctor["next"]) {
  if (date === TODAY) return `Today, ${formatTime(time)}`;
  if (date === addDays(TODAY, 1)) return `Tomorrow, ${formatTime(time)}`;
  return formatDate(date, { month: "short", day: "numeric", year: "numeric" });
}

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const [favorite, setFavorite] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const titleId = useId();
  const onLeave = doctor.status === "On Leave";

  return (
    <>
    <article className={styles.card}>
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

      <div className={styles.identity}>
        <Avatar name={doctor.name} src={doctor.photo} size={56} online={!onLeave} />
        <div className={styles.identityText}><h3>{doctor.name}</h3><p>{doctor.title}</p></div>
      </div>
      <div className={styles.credentials}>
        <p className={styles.rating}>
          <LuStar aria-hidden />
          {doctor.reviews > 0 ? (
            <span className="text-small">
              <strong>{doctor.rating.toFixed(1)}</strong>{" "}
              <span className="text-muted">
                ({doctor.reviews} reviews)
              </span>
            </span>
          ) : (
            <span className="text-small text-muted">No reviews yet</span>
          )}
        </p>
        <span>{doctor.experience} years’ experience</span>
      </div>

      <p className={styles.next}>
        <span className={styles.availabilityLabel}><LuClock aria-hidden />{onLeave ? "On leave · Returns" : "Next available"}</span>
        <span className={styles.availabilityTime}>{slotLabel(doctor.next)}</span>
      </p>

      <div className={styles.actions}>
        <button type="button" className={styles.profileLink} onClick={() => setProfileOpen(true)}>View profile <LuArrowUpRight /></button>
        <Button href="/appointments" variant="soft" size="sm">Book visit</Button>
      </div>
    </article>
    <Modal open={profileOpen} onClose={() => setProfileOpen(false)} labelledBy={titleId} width={480}><ModalPanel><ModalHeader title={doctor.name} titleId={titleId} description={doctor.title} leading={<Avatar name={doctor.name} src={doctor.photo} size={56} />} onClose={() => setProfileOpen(false)} /><ModalBody><dl className={styles.profileDetails}><div><dt>Experience</dt><dd>{doctor.experience} years</dd></div><div><dt>Patients</dt><dd>{doctor.patients}</dd></div><div><dt>Location</dt><dd>{doctor.location.site}, {doctor.location.floor}</dd></div><div><dt>{onLeave ? "Returns" : "Next available"}</dt><dd>{slotLabel(doctor.next)}</dd></div></dl></ModalBody><ModalFooter><Button variant="secondary" onClick={() => setProfileOpen(false)}>Close</Button><Button href="/appointments">Book visit</Button></ModalFooter></ModalPanel></Modal>
    </>
  );
}
