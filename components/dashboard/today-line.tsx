"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Subtitle for the dashboard header: today's date, then a short orientation line. The date fills in on the client (no hydration mismatch). */
export function TodayLine() {
  const date = useSyncExternalStore(
    subscribe,
    () => new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
    () => "",
  );

  return <>{date ? `${date}. Here's your clinic overview.` : "Here's your clinic overview."}</>;
}
