import type { ReactNode } from "react";
import { Counter } from "./counter";

type TabsProps<T extends string> = {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  /** id of the element these tabs control (the tab panel). */
  panelId: string;
  /** Optional icon shown before a tab's label. */
  icons?: Partial<Record<T, ReactNode>>;
  /** Optional count badge after a tab's label. */
  counts?: Partial<Record<T, number>>;
  /** `underline` (default) sits on a divider; `pill` outlines the active tab, for tabs above a table or list inside a card. */
  variant?: "underline" | "pill";
  "aria-label": string;
};

/** Tabs that switch the content of a single panel: underline or pill style, optionally with icons and counts. */
export function Tabs<T extends string>({ value, options, onChange, panelId, icons, counts, variant = "underline", ...rest }: TabsProps<T>) {
  return (
    <div className={variant === "pill" ? "tabs tabs-pill" : "tabs"} role="tablist" {...rest}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="tab"
          id={`${panelId}-tab-${option}`}
          aria-selected={option === value}
          aria-controls={panelId}
          onClick={() => onChange(option)}
        >
          {icons?.[option]}
          {option}
          {counts?.[option] !== undefined && (
            <Counter size="sm" tone={option === value ? "primary" : "neutral"} aria-hidden>
              {counts[option]}
            </Counter>
          )}
        </button>
      ))}
    </div>
  );
}

/** Id of the tab button for `value`, for the panel's `aria-labelledby`. */
export const tabId = (panelId: string, value: string) => `${panelId}-tab-${value}`;
