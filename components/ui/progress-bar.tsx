import type { Tone } from "./tone-tile";

type ProgressBarProps = {
  /** 0–100 */
  value: number;
  tone?: Tone;
  size?: "md" | "sm";
  "aria-label": string;
};

export function ProgressBar({ value, tone = "primary", size = "md", ...rest }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <span
      className={size === "sm" ? "progress progress-sm" : "progress"}
      data-tone={tone}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      {...rest}
      style={{ display: "block" }}
    >
      <span className="progress-fill" style={{ width: `${clamped}%` }} />
    </span>
  );
}
