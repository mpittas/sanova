"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef, type ComponentPropsWithRef, type CSSProperties, type ReactNode } from "react";
import { LuX } from "react-icons/lu";
import { Button } from "./button";

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

// ---------------------------------------------------------------------------------------------
// Dialog contents. Every dialog is a ModalPanel (or ModalForm) holding a ModalHeader, a ModalBody
// that scrolls on its own, and a ModalFooter with the actions.
// ---------------------------------------------------------------------------------------------

const panelClass = (className?: string) => ["modal-panel", className].filter(Boolean).join(" ");

/** The column that lays out a dialog's header, body and footer. */
export function ModalPanel({ className, ...rest }: ComponentPropsWithoutRef<"div">) {
  return <div className={panelClass(className)} {...rest} />;
}

/** Same as `ModalPanel`, but a `<form>`: submitting it runs `onSubmit`. Browser validation is off; use `Field` errors. */
export function ModalForm({ className, ...rest }: ComponentPropsWithRef<"form">) {
  return <form className={panelClass(className)} noValidate {...rest} />;
}

/** Title, one-line description and close button. `leading` (an avatar) and `trailing` (a status chip) sit around the text. */
export function ModalHeader({
  title,
  titleId,
  description,
  leading,
  trailing,
  onClose,
}: {
  title: ReactNode;
  /** Must match the `labelledBy` of the surrounding `Modal`. */
  titleId: string;
  description?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  onClose: () => void;
}) {
  return (
    <header className="modal-head">
      {leading}
      <div className="modal-title">
        <h2 id={titleId} className="text-h2">
          {title}
        </h2>
        {description && <p className="text-body text-muted">{description}</p>}
      </div>
      {trailing}
      <Button variant="secondary" iconOnly onClick={onClose} aria-label="Close">
        <LuX />
      </Button>
    </header>
  );
}

export function ModalBody({ className, ...rest }: ComponentPropsWithoutRef<"div">) {
  return <div className={["modal-body", className].filter(Boolean).join(" ")} {...rest} />;
}

/** Right-aligned actions under a hairline: the secondary action first, the primary one last. */
export function ModalFooter({ className, ...rest }: ComponentPropsWithoutRef<"footer">) {
  return <footer className={["modal-footer", className].filter(Boolean).join(" ")} {...rest} />;
}
