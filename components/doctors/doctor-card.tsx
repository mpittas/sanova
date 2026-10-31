"use client";

import Link from "next/link";
import { useState } from "react";
import { LuHeart, LuStar } from "react-icons/lu";
import { Avatar } from "@/components/ui/avatar";
import { BookAppointmentButton } from "@/components/booking/book-appointment-button";
import { Button } from "@/components/ui/button";
import { doctorById, type Doctor } from "./data";
import { slotLabel } from "./slot-label";
import styles from "./doctors.module.css";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const [favorite, setFavorite] = useState(false);
  const onLeave = doctor.status === "On Leave";
  // Doctors added during this session have no profile page yet, so their card stays a plain card.
  const profileHref = doctorById(doctor.id) ? `/doctors/${doctor.id}` : null;

  return (
    <article className={`glass ${styles.card}`} data-linked={profileHref ? "" : undefined}>
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
        <div className={styles.identityText}>
          <h3>
            {/* The link's ::after covers the whole card, so clicking anywhere opens the profile. */}
            {profileHref ? <Link href={profileHref} className={styles.cardLink}>{doctor.name}</Link> : doctor.name}
          </h3>
          <p>{doctor.title}</p>
        </div>
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
        <span className={styles.availabilityLabel}>{onLeave ? "On leave · Returns" : "Next available"}</span>
        <span className={styles.availabilityTime}>{slotLabel(doctor.next)}</span>
      </p>

      <div className={styles.actions}>
        {profileHref && <span className={styles.profileLink} aria-hidden>View profile</span>}
        {onLeave ? (
          <Button variant="soft" size="sm" className={styles.book} disabled>Book visit</Button>
        ) : (
          <BookAppointmentButton prefill={{ doctorId: doctor.id }} variant="soft" size="sm" className={styles.book}>Book visit</BookAppointmentButton>
        )}
      </div>
    </article>
  );
}
