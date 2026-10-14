import type { ComponentPropsWithoutRef, ReactNode } from "react";

type TextInputProps = Omit<ComponentPropsWithoutRef<"input">, "size"> & {
  /** Leading icon inside the field. */
  icon?: ReactNode;
  /** `md` is 44px, `lg` is 50px (forms in dialogs). */
  size?: "md" | "lg";
  invalid?: boolean;
  wrapperClassName?: string;
};

/** Single-line form input with an optional leading icon. Pair it with `Field` for the label and error. */
export function TextInput({ icon, size = "md", invalid, wrapperClassName, ...inputProps }: TextInputProps) {
  const classes = ["input", size === "lg" && "input-lg", wrapperClassName].filter(Boolean).join(" ");
  return (
    <div className={classes} data-icon={icon ? "" : undefined} data-invalid={invalid || undefined}>
      {icon}
      <input aria-invalid={invalid || undefined} {...inputProps} />
    </div>
  );
}

type TextAreaProps = ComponentPropsWithoutRef<"textarea">;

/** Multi-line form input. */
export function TextArea({ className, ...rest }: TextAreaProps) {
  return <textarea className={["textarea", className].filter(Boolean).join(" ")} {...rest} />;
}
