type SegmentedProps<T extends string> = {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  "aria-label": string;
};

/** Small toggle group for switching between a few views (Day / Week / Month). */
export function Segmented<T extends string>({ value, options, onChange, ...rest }: SegmentedProps<T>) {
  return (
    <div className="segmented" role="group" {...rest}>
      {options.map((option) => (
        <button key={option} type="button" aria-pressed={option === value} onClick={() => onChange(option)}>
          {option}
        </button>
      ))}
    </div>
  );
}
