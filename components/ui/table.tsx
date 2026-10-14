import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { LuArrowDown, LuArrowUp, LuChevronsUpDown } from "react-icons/lu";

type TableProps = Omit<ComponentPropsWithoutRef<"table">, "children"> & {
  /** `simple` sits inside a padded card; `banded` is edge-to-edge with a tinted header and row hover. */
  variant?: "simple" | "banded";
  /** Below this width the table scrolls horizontally instead of squashing. */
  minWidth?: number;
  children: ReactNode;
};

export function Table({ variant = "banded", minWidth, className, style, children, ...rest }: TableProps) {
  return (
    <div className="table-wrap">
      <table
        className={["table", `table-${variant}`, className].filter(Boolean).join(" ")}
        style={{ ...style, minWidth }}
        {...rest}
      >
        {children}
      </table>
    </div>
  );
}

type ThProps = Omit<ComponentPropsWithoutRef<"th">, "onClick"> & {
  /** Makes the header a sort button. `direction` is the current sort on this column (null = unsorted). */
  sort?: { direction: "asc" | "desc" | null; onSort: () => void };
};

/** Table header cell, optionally sortable. */
export function Th({ sort, children, ...rest }: ThProps) {
  if (!sort) return <th {...rest}>{children}</th>;

  const Icon = sort.direction === "asc" ? LuArrowUp : sort.direction === "desc" ? LuArrowDown : LuChevronsUpDown;
  const ariaSort = sort.direction === "asc" ? "ascending" : sort.direction === "desc" ? "descending" : undefined;

  return (
    <th aria-sort={ariaSort} {...rest}>
      <button type="button" className="table-sort" data-active={sort.direction ? "" : undefined} onClick={sort.onSort}>
        {children}
        <Icon aria-hidden />
      </button>
    </th>
  );
}
