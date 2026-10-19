"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type TriggerProps = { "aria-expanded": boolean; "aria-haspopup": "dialog"; onClick: () => void };

type PopoverProps = {
  /** Renders the button that opens the panel; spread `props` onto it. */
  trigger: (props: TriggerProps & { open: boolean }) => ReactNode;
  /** The panel contents. Pass a function to receive `close`. */
  children: ReactNode | ((close: () => void) => ReactNode);
  /** Which edge of the trigger the panel lines up with. */
  align?: "start" | "end";
  /** Panel width in px (never wider than the screen). */
  width?: number;
  /** Accessible name of the panel. */
  label: string;
};

/** A floating panel under a trigger. Closes on Escape and when you click outside it. */
export function Popover({ trigger, children, align = "end", width = 360, label }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="popover-anchor">
      {trigger({ open, "aria-expanded": open, "aria-haspopup": "dialog", onClick: () => setOpen((value) => !value) })}
      {open && (
        <div className="popover" data-align={align} style={{ width }} role="dialog" aria-label={label}>
          {typeof children === "function" ? children(close) : children}
        </div>
      )}
    </div>
  );
}
