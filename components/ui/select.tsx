import { LuChevronDown } from "react-icons/lu";
import type { ComponentPropsWithoutRef } from "react";

type SelectProps<T extends string> = Omit<ComponentPropsWithoutRef<"select">, "value" | "onChange"> & {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  "aria-label": string;
};

export function Select<T extends string>({ value, options, onChange, ...rest }: SelectProps<T>) {
  return (
    <span className="select">
      <select value={value} onChange={(event) => onChange(event.target.value as T)} {...rest}>
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
