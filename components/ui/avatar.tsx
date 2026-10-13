import type { CSSProperties } from "react";
import type { PaletteName } from "@/lib/tokens";

const tints: PaletteName[] = ["primary", "success", "violet", "coral", "amber", "teal"];

function initials(name: string) {
  return name
    .replace(/^Dr\.?\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/** Initials avatar with a stable tint derived from the name. */
export function Avatar({ name, size = 48 }: { name: string; size?: number }) {
  const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const tint = tints[hash % tints.length];
  const style = {
    "--size": `${size}px`,
    background: `var(--color-${tint}-100)`,
    color: `var(--color-${tint}-700)`,
  } as CSSProperties;

  return (
    <span className="avatar" style={style} aria-hidden>
      {initials(name)}
    </span>
  );
}
