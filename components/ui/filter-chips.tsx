import { LuChevronDown } from "react-icons/lu";

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
  /** Up to this many options show as a text row; more collapse into a dropdown. */
  maxInline?: number;
  className?: string;
};

const text = <T extends string>({ value, label, count }: FilterChipOption<T>) =>
  `${label ?? value}${count !== undefined ? ` (${count})` : ""}`;

/**
 * Quiet single-select filter with item counts: a plain text row with an underline on the active option, or a
 * dropdown when there are too many options to fit on one line.
 */
export function FilterChips<T extends string>({ value, options, onChange, maxInline = 5, className, ...rest }: FilterChipsProps<T>) {
  if (options.length > maxInline) {
    return (
      <span className={["select", "select-md", "filter-select", className].filter(Boolean).join(" ")}>
        <select value={value} onChange={(event) => onChange(event.target.value as T)} {...rest}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {text(option)}
            </option>
          ))}
        </select>
        <LuChevronDown aria-hidden />
      </span>
    );
  }

  return (
    <div className={["filter-chips", className].filter(Boolean).join(" ")} role="group" {...rest}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className="filter-chip"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label ?? option.value}
          {option.count !== undefined && <span className="filter-chip-count num">{option.count}</span>}
        </button>
      ))}
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
