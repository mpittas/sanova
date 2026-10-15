import type { ReactNode } from "react";
import { Button } from "./button";

type FilterBarProps = {
  /** The row of `FilterChips`. */
  chips?: ReactNode;
  /** Search field, selects and the Filters button. */
  children: ReactNode;
  /** For toolbars inside a card: adds the card's padding. */
  inset?: boolean;
};

/**
 * The toolbar above a list: filter chips on the left, search and other controls on the right.
 * When there is no room for both, the controls drop to their own row.
 */
export function FilterBar({ chips, children, inset = false }: FilterBarProps) {
  return (
    <div className={inset ? "filter-bar filter-bar-inset" : "filter-bar"}>
      {chips && <div className="filter-bar-chips">{chips}</div>}
      <div className="filter-bar-tools">{children}</div>
    </div>
  );
}

/** Extra filters revealed by the Filters button: labelled selects and a reset link. */
export function FilterPanel({
  id,
  children,
  onReset,
  canReset,
  inset = false,
}: {
  /** Same id the Filters button points at with `aria-controls`. */
  id: string;
  children: ReactNode;
  onReset: () => void;
  /** Whether any filter is active. */
  canReset: boolean;
  inset?: boolean;
}) {
  return (
    <div id={id} className={inset ? "filter-panel filter-panel-inset" : "filter-panel"}>
      {children}
      <Button variant="ghost" size="sm" disabled={!canReset} onClick={onReset}>
        Reset filters
      </Button>
    </div>
  );
}

/** A select with its label above it, for a `FilterPanel`. */
export function FilterField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="filter-field">
      <span className="text-small text-muted">{label}</span>
      {children}
    </label>
  );
}
