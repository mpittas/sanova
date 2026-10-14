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

type AvatarProps = {
  name: string;
  size?: number;
  /** Portrait URL. Defaults to the sample portrait registered for `name`, if any. */
  src?: string;
  /** Shows a green presence dot. */
  online?: boolean;
  /** `circle` (default) or a softly `rounded` square, for profile cards. */
  shape?: "circle" | "rounded";
  /** Corner radius in px for `shape="rounded"`. Defaults to 20% of `size`. */
  radius?: number;
};

/** Round avatar: shows the person's portrait when we have one, otherwise (or if it fails to load) their initials. */
export function Avatar({ name, size = 48, src, online = false, shape = "circle", radius }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const photo = src ?? portraits[name];

  const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const tint = tints[hash % tints.length];
  const style = {
    "--size": `${size}px`,
    ...(radius !== undefined && { "--radius": `${radius}px` }),
    background: `var(--color-${tint}-100)`,
    color: `var(--color-${tint}-700)`,
  } as CSSProperties;

  const avatar = (
    <span className={shape === "rounded" ? "avatar avatar-rounded" : "avatar"} style={style} aria-hidden>
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

  if (!online) return avatar;

  return (
    <span className="avatar-wrap">
      {avatar}
      <span className="avatar-presence" role="img" aria-label="Online" />
    </span>
  );
}
