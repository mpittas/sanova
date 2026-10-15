import { useState } from "react";

/**
 * Splits a list into pages. `page` is clamped, so it stays valid when the list shrinks (a filter was applied).
 * Call `reset()` when a filter changes so the user lands on the first page.
 */
export function usePagination<T>(items: readonly T[], pageSize: number) {
  const [requested, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(requested, totalPages);
  const firstIndex = (page - 1) * pageSize;
  const visible = items.slice(firstIndex, firstIndex + pageSize);

  return { page, setPage, reset: () => setPage(1), totalPages, firstIndex, visible, total: items.length };
}
