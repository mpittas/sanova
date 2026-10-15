import type { CSSProperties, ReactNode } from "react";

type SplitLayoutProps = {
  /** Width of the side column: `sm` 380px (calendars, summaries), `md` 440px (record panels), `lg` 460–540px (a detail view). */
  side?: "sm" | "md" | "lg";
  /** CSS `grid-template-columns` for pages that split the width in a fixed ratio, e.g. a list and its detail. Replaces `side`. */
  columns?: string;
  /** Makes the side column a labelled landmark ("Team summary"). Leave it out when the column holds the page's own detail view. */
  sideLabel?: string;
  /** The side column's content, stacked with a 20px gap. */
  aside: ReactNode;
  /** The main column's content, stacked with a 20px gap. */
  children: ReactNode;
};

/**
 * Main column plus a side column. Under 1100px of content width the side column drops below the main one,
 * and its cards flow into a grid so they use the full width.
 */
export function SplitLayout({ side = "sm", columns, sideLabel, aside, children }: SplitLayoutProps) {
  return (
    <div className="split-layout" data-side={columns ? undefined : side} style={columns ? ({ "--split-columns": columns } as CSSProperties) : undefined}>
      <div className="split-main">{children}</div>
      {sideLabel ? (
        <aside className="split-side" aria-label={sideLabel}>
          {aside}
        </aside>
      ) : (
        <div className="split-side">{aside}</div>
      )}
    </div>
  );
}
