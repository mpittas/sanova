"use client";

import { useState, type ReactNode } from "react";
import { LuSearch, LuX } from "react-icons/lu";
import { SearchInput } from "./search-input";

type ListHeadingProps = {
  title: string;
  count: number;
  /** Search behind the magnifier button on the right. Closing it clears the query. */
  search: { label: string; placeholder: string; value: string; onChange: (value: string) => void };
  /** The dropdowns, shown after the search button. Use `<Select size="md">` so every page matches. */
  children?: ReactNode;
};

/**
 * Heading of a list card (patient records, medications, lab tests): the title with its count on the left, and on the right
 * a search button that swaps the title for a search field, then the filter dropdowns. Same sizes on every page.
 */
export function ListHeading({ title, count, search, children }: ListHeadingProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="list-heading">
      {open ? (
        <SearchInput
          autoFocus
          wrapperClassName="list-heading-search"
          label={search.label}
          placeholder={search.placeholder}
          value={search.value}
          onChange={(event) => search.onChange(event.target.value)}
        />
      ) : (
        <h2 className="list-heading-title">
          {title}
          <span className="list-heading-count" aria-label={`${count} ${title.toLowerCase()}`}>
            {count}
          </span>
        </h2>
      )}
      <div className="list-heading-tools">
        <button
          type="button"
          className="list-heading-toggle"
          aria-label={open ? "Close search" : search.label}
          aria-expanded={open}
          onClick={() => {
            if (open) search.onChange("");
            setOpen(!open);
          }}
        >
          {open ? <LuX /> : <LuSearch />}
        </button>
        {children}
      </div>
    </header>
  );
}
