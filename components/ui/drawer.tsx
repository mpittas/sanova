"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { LuX } from "react-icons/lu";
import { Button } from "./button";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  /** id of the element that titles the panel. */
  labelledBy: string;
  /** Panel width in px (never wider than the screen). */
  width?: number;
  children: ReactNode;
};

/**
 * A panel that slides in from the right edge, for looking at one item without leaving the list behind it.
 * Built on the native `<dialog>`: focus is trapped, Escape and a click on the backdrop close it.
 */
export function Drawer({ open, onClose, labelledBy, width = 480, children }: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="drawer"
      style={{ "--drawer-width": `${width}px` } as React.CSSProperties}
      aria-labelledby={labelledBy}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onMouseDown={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      {open && children}
    </dialog>
  );
}

/** Title block and close button at the top of a drawer. `leading` (an avatar) sits before the text. */
export function DrawerHeader({ title, titleId, description, leading, onClose }: { title: ReactNode; titleId: string; description?: ReactNode; leading?: ReactNode; onClose: () => void }) {
  return (
    <header className="drawer-head">
      {leading}
      <div className="drawer-title">
        <h2 id={titleId}>{title}</h2>
        {description}
      </div>
      <Button variant="secondary" iconOnly onClick={onClose} aria-label="Close">
        <LuX />
      </Button>
    </header>
  );
}
