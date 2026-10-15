"use client";

import { useEffect, useRef } from "react";
import { LuCircleCheck, LuX } from "react-icons/lu";
import { Button } from "./button";

type NoticeProps = {
  /** What happened, in a sentence. Nothing is rendered while this is empty. */
  message: string | null | undefined;
  /** Called when the notice is dismissed, or fades after `autoDismiss`. */
  onDismiss: () => void;
  /** Milliseconds before the notice dismisses itself. Pass 0 to keep it until it is dismissed. */
  autoDismiss?: number;
  className?: string;
};

/** Green confirmation banner for the result of an action ("Booked Mia Wong…"). Fades after a few seconds and can be dismissed. */
export function Notice({ message, onDismiss, autoDismiss = 6000, className }: NoticeProps) {
  // The timer restarts only for a new message, not whenever the parent re-renders with a fresh `onDismiss` function.
  const dismiss = useRef(onDismiss);
  useEffect(() => {
    dismiss.current = onDismiss;
  });
  useEffect(() => {
    if (!message || autoDismiss === 0) return;
    const timer = window.setTimeout(() => dismiss.current(), autoDismiss);
    return () => window.clearTimeout(timer);
  }, [message, autoDismiss]);

  if (!message) return null;

  return (
    <div className={["notice", className].filter(Boolean).join(" ")} role="status">
      <LuCircleCheck aria-hidden />
      <p className="text-label">{message}</p>
      <Button variant="ghost" size="sm" iconOnly aria-label="Dismiss" onClick={onDismiss}>
        <LuX />
      </Button>
    </div>
  );
}
