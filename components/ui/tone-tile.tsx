import type { CSSProperties, ReactNode } from "react";
import type { PaletteName } from "@/lib/tokens";

export type Tone = Exclude<PaletteName, "neutral">;

/** Tinted rounded tile holding an icon. */
export function ToneTile({ tone, size = 48, children }: { tone: Tone; size?: number; children: ReactNode }) {
  return (
    <span className="tone-tile" data-tone={tone} style={{ "--size": `${size}px` } as CSSProperties} aria-hidden>
      {children}
    </span>
  );
}
