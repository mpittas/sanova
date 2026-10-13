"use client";

import { useSyncExternalStore } from "react";
import { LuCalendarDays } from "react-icons/lu";
import styles from "./dashboard.module.css";

const subscribe = () => () => {};

/** Today's date as a small eyebrow. Empty on the server, filled in on the client (no hydration mismatch). */
export function TodayEyebrow() {
  const label = useSyncExternalStore(
    subscribe,
    () => new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
    () => "",
  );

  return (
    <p className={styles.eyebrow}>
      <LuCalendarDays aria-hidden />
      <span>{label}</span>
    </p>
  );
}
