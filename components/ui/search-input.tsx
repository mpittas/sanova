import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { LuSearch } from "react-icons/lu";

type SearchInputProps = Omit<ComponentPropsWithoutRef<"input">, "type" | "size"> & {
  /** Accessible name; the field has no visible label. */
  label: string;
  /** Optional control shown inside the right edge (e.g. a voice-search button). */
  trailing?: ReactNode;
  /** Use a white field on tinted backgrounds. */
  tone?: "tinted" | "white";
  wrapperClassName?: string;
};

export function SearchInput({ label, trailing, tone = "tinted", wrapperClassName, ...inputProps }: SearchInputProps) {
  const classes = ["search-input", tone === "white" && "search-input-white", wrapperClassName].filter(Boolean).join(" ");
  return (
    <div className={classes} data-trailing={trailing ? "" : undefined}>
      <LuSearch aria-hidden />
      <input type="search" aria-label={label} {...inputProps} />
      {trailing && <span className="search-input-trailing">{trailing}</span>}
    </div>
  );
}
