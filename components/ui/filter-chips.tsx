import { Counter } from "./counter";

export type FilterChipOption<T extends string> = {
  value: T;
  label?: string;
  /** Number of items the filter would show. */
  count?: number;
};

type FilterChipsProps<T extends string> = {
  value: T;
  options: readonly FilterChipOption<T>[];
  onChange: (value: T) => void;
  "aria-label": string;
  /** `soft` (default) tints the active chip; `solid` fills it with the brand green, for chips that sit directly on the page. */
  variant?: "soft" | "solid";
  className?: string;
};

/** Row of pill filters with item counts. One is active at a time; wraps (or scrolls, via `className`) on narrow screens. */
export function FilterChips<T extends string>({ value, options, onChange, variant = "soft", className, ...rest }: FilterChipsProps<T>) {
  return (
    <div
      className={["filter-chips", variant === "solid" && "filter-chips-solid", className].filter(Boolean).join(" ")}
      role="group"
      {...rest}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            className="filter-chip"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
          >
            {option.label ?? option.value}
            {option.count !== undefined && <Counter tone={active ? "soft" : "neutral"}>{option.count}</Counter>}
          </button>
        );
      })}
    </div>
  );
}

type ChoiceChipsProps<T extends string> = {
  /** The options currently selected. */
  value: readonly T[];
  options: readonly T[];
  onToggle: (option: T) => void;
  "aria-label": string;
  className?: string;
};

/** Same chips as `FilterChips`, but any number can be on at once: working days, focus areas, languages. */
export function ChoiceChips<T extends string>({ value, options, onToggle, className, ...rest }: ChoiceChipsProps<T>) {
  return (
    <div className={["filter-chips", "choice-chips", className].filter(Boolean).join(" ")} role="group" {...rest}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className="filter-chip"
          aria-pressed={value.includes(option)}
          onClick={() => onToggle(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
