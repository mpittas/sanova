import { useId, type ReactNode } from "react";
import { LuCircleAlert } from "react-icons/lu";

/** Props to spread onto the control inside a Field so the label, hint and error are wired up for assistive tech. */
export type FieldControlProps = {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  required?: true;
};

type FieldProps = {
  label: ReactNode;
  required?: boolean;
  /** Muted helper text under the control. */
  hint?: ReactNode;
  /** Error message; also marks the control invalid. Say what is wrong and how to fix it. */
  error?: string;
  className?: string;
  children: (control: FieldControlProps) => ReactNode;
};

/** Label + control + hint/error. The control is a render prop so it receives its `id` and ARIA attributes. */
export function Field({ label, required, hint, error, className, children }: FieldProps) {
  const id = useId();
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(" ") || undefined;

  return (
    <div className={["field", className].filter(Boolean).join(" ")}>
      <label className="field-label" htmlFor={id}>
        {label}
        {required && (
          <span className="field-required" aria-hidden>
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {children({
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
        required: required ? true : undefined,
      })}
      {hint && !error && (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error">
          <LuCircleAlert aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}
