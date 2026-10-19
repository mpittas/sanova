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
  const range = `${firstIndex + 1}–${firstIndex + shown}`;
  const word = total === 1 ? noun[0] : noun[1];

  return (
    <div className={inset ? "results-footer results-footer-inset" : "results-footer"}>
      <p className="text-small text-muted" aria-live="polite">
        {total === 0 ? (
          <>
            Showing <span className="num">0</span> {noun[1]}
          </>
        ) : (
          <>
            Showing <span className="num">{range}</span> of <span className="num">{total}</span> {word}
          </>
        )}
      </p>
      <span className="spacer" />
      {children}
      <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
    </div>
  );
}
