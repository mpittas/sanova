import Link from "next/link";
import type { ReactNode } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import { Counter } from "./counter";
import { ToneTile, type Tone } from "./tone-tile";

type ActionTileProps = {
  label: string;
  icon: ReactNode;
  tone: Tone;
  /** How many things are waiting behind this action (shown instead of the arrow). */
  badge?: number;
} & ({ href: string; onClick?: undefined } | { onClick?: () => void; href?: undefined });

/** Shortcut tile: a tinted icon and a label. A link when it has an `href`, otherwise a button. */
export function ActionTile({ label, icon, tone, badge, href, onClick }: ActionTileProps) {
  const content = (
    <>
      <ToneTile tone={tone} size={38}>
        {icon}
      </ToneTile>
      <span className="action-tile-label">
        {label}
        {badge ? <span className="sr-only">, {badge} waiting</span> : null}
      </span>
      {badge ? (
        <Counter size="sm" className="action-tile-end" aria-hidden>
          {badge}
        </Counter>
      ) : (
        <LuArrowUpRight className="action-tile-end action-tile-arrow" aria-hidden />
      )}
    </>
  );

  return href ? (
    <Link href={href} className="action-tile" data-tone={tone}>
      {content}
    </Link>
  ) : (
    <button type="button" className="action-tile" data-tone={tone} onClick={onClick}>
      {content}
    </button>
  );
}

/** Responsive grid of `ActionTile`s. */
export function ActionGrid({ children }: { children: ReactNode }) {
  return <div className="action-grid">{children}</div>;
}
