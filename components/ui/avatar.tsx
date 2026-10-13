"use client";

import { useState, type CSSProperties } from "react";
import { portraits } from "@/lib/portraits";
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

/** Round avatar: shows the person's portrait when we have one, otherwise (or if it fails to load) their initials. */
export function Avatar({ name, size = 48, src }: { name: string; size?: number; src?: string }) {
  const [failed, setFailed] = useState(false);
  const photo = src ?? portraits[name];

  const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const tint = tints[hash % tints.length];
  const style = {
    "--size": `${size}px`,
    background: `var(--color-${tint}-100)`,
    color: `var(--color-${tint}-700)`,
  } as CSSProperties;

  return (
    <span className="avatar" style={style} aria-hidden>
      {/* Initials sit underneath, so there is never an empty circle while the photo loads or if it fails. */}
      {initials(name)}
      {photo && !failed && (
        // Small remote portraits: a plain <img> avoids image-optimizer setup for placeholder photos.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt=""
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
