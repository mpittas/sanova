import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import styles from "./patients.module.css";

/** 1 … 4 5 6 … 42 — always keeps first, last and the pages around the current one. */
function pageItems(page: number, total: number): (number | "gap-start" | "gap-end")[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  const pages = new Set([1, total, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((value) => pages.add(value));
  if (page >= total - 2) [total - 3, total - 2, total - 1].forEach((value) => pages.add(value));

  const sorted = [...pages].filter((value) => value >= 1 && value <= total).sort((a, b) => a - b);
  const items: (number | "gap-start" | "gap-end")[] = [];
  sorted.forEach((value, index) => {
    if (index > 0 && value - sorted[index - 1] > 1) items.push(index === 1 ? "gap-start" : "gap-end");
    items.push(value);
  });
  return items;
}

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button type="button" className={styles.pageButton} aria-label="Previous page" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <LuChevronLeft aria-hidden />
      </button>

      {pageItems(page, totalPages).map((item) =>
        typeof item === "number" ? (
          <button
            key={item}
            type="button"
            className={styles.pageButton}
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            onClick={() => onChange(item)}
          >
            {item}
          </button>
        ) : (
          <span key={item} className={styles.pageGap} aria-hidden>
            …
          </span>
        ),
      )}

      <button
        type="button"
        className={styles.pageButton}
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        <LuChevronRight aria-hidden />
      </button>
    </nav>
  );
}
