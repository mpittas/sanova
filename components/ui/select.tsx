import { LuChevronDown } from "react-icons/lu";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type SelectProps<T extends string> = Omit<ComponentPropsWithoutRef<"select">, "value" | "onChange" | "size"> & {
  /** `""` shows the placeholder. */
  value: T | "";
  options: readonly T[];
  onChange: (value: T) => void;
  /** `sm` (32px) for card headers, `md` (44px) to sit beside default buttons and search fields, `lg` (50px) for forms. */
  size?: "sm" | "md" | "lg";
  /** Turns the select into a form field: fills its container, tinted background, and a placeholder option. */
  placeholder?: string;
  /** Leading icon inside the field (form selects only). */
  icon?: ReactNode;
  invalid?: boolean;
  "aria-label"?: string;
};

export function Select<T extends string>({
  value,
  options,
  onChange,
  size = "sm",
  placeholder,
  icon,
  invalid,
  ...rest
}: SelectProps<T>) {
  const isField = placeholder !== undefined;
  const classes = ["select", size !== "sm" && `select-${size}`, isField && "select-field"].filter(Boolean).join(" ");

  return (
    <span className={classes} data-icon={icon && isField ? "" : undefined} data-invalid={invalid || undefined}>
      {icon && isField && <span className="select-icon">{icon}</span>}
      <select
        value={value}
        data-placeholder={isField && value === "" ? "" : undefined}
        aria-invalid={invalid || undefined}
        onChange={(event) => onChange(event.target.value as T)}
        {...rest}
      >
        {isField && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <LuChevronDown aria-hidden />
    </span>
  );
}
