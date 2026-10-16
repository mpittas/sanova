import type { CSSProperties } from "react";
import type { Tone } from "./tone-tile";

type ProgressBarProps = {
  /** 0–100 */
  value: number;
  tone?: Tone;
  /** Fill colour that overrides the tone, e.g. a shade picked from the value. */
  color?: string;
  size?: "md" | "sm";
  "aria-label": string;
  /** Spoken value when it differs from the bar's position, e.g. "25%" on a bar scaled to the largest. */
  "aria-valuetext"?: string;
};

export function ProgressBar({ value, tone = "primary", color, size = "md", ...rest }: ProgressBarProps) {
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
      style={{ display: "block", "--tone-fg": color } as CSSProperties}
    >
      <span className="progress-fill" style={{ width: `${clamped}%` }} />
    </span>
  );
}
