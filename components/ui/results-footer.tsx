import type { ReactNode } from "react";
import { Pagination } from "./pagination";

type ResultsFooterProps = {
  /** 1-based index of the first item shown, and how many are shown. */
  firstIndex: number;
  shown: number;
  total: number;
  /** What the items are called, singular and plural: ["doctor", "doctors"]. */
  noun: readonly [string, string];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Extra controls before the pagination (a rows-per-page select). */
  children?: ReactNode;
  /** For footers inside a card: adds the card's padding and a hairline above. */
  inset?: boolean;
};

/** "Showing 1–6 of 24 doctors" on the left, page controls on the right. Sits under every paginated list. */
export function ResultsFooter({ firstIndex, shown, total, noun, page, totalPages, onPageChange, children, inset = false }: ResultsFooterProps) {
  const label =
    total === 0 ? `Showing 0 ${noun[1]}` : `Showing ${firstIndex + 1}–${firstIndex + shown} of ${total} ${total === 1 ? noun[0] : noun[1]}`;

  return (
    <div className={inset ? "results-footer results-footer-inset" : "results-footer"}>
      <p className="text-small text-muted num" aria-live="polite">
        {label}
      </p>
      <span className="spacer" />
      {children}
      <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
    </div>
  );
}
