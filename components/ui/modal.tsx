"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  /** Called on Escape and when the backdrop is clicked. */
  onClose: () => void;
  /** id of the element that titles the dialog. */
  labelledBy: string;
  /** Preferred width in px (never wider than the screen). */
  width?: number;
  /** Close when the backdrop is clicked. Turn off for long forms where a stray click would lose work. */
  dismissOnBackdrop?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Dialog built on the native `<dialog>` element: it traps focus, closes on Escape and makes the page behind it inert.
 * Children are only mounted while open, so any state inside them resets each time it is shown.
 */
export function Modal({ open, onClose, labelledBy, width = 640, dismissOnBackdrop = true, className, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const pressedOnBackdrop = useRef(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Keep the page behind from scrolling while the dialog is open.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={["modal", className].filter(Boolean).join(" ")}
      style={{ "--modal-width": `${width}px` } as CSSProperties}
      aria-labelledby={labelledBy}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      // Only a press that both starts and ends on the backdrop closes it, so dragging a text selection out of a field doesn't.
      onMouseDown={(event) => {
        pressedOnBackdrop.current = event.target === ref.current;
      }}
      onClick={(event) => {
        if (dismissOnBackdrop && pressedOnBackdrop.current && event.target === ref.current) onClose();
      }}
    >
      {open && children}
    </dialog>
  );
}
