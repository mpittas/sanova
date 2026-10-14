type TabsProps<T extends string> = {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  /** id of the element these tabs control (the tab panel). */
  panelId: string;
  "aria-label": string;
};

/** Underline tabs that switch the content of a single panel. */
export function Tabs<T extends string>({ value, options, onChange, panelId, ...rest }: TabsProps<T>) {
  return (
    <div className="tabs" role="tablist" {...rest}>
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
          {option}
        </button>
      ))}
    </div>
  );
}

/** Id of the tab button for `value`, for the panel's `aria-labelledby`. */
export const tabId = (panelId: string, value: string) => `${panelId}-tab-${value}`;
