"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { LuCheck, LuChevronDown, LuSearch } from "react-icons/lu";

export type ListboxOption<T extends string> = {
  value: T;
  label: string;
  /** Muted second line: a role, an ID, a duration. */
  description?: ReactNode;
  /** An avatar or tinted icon in front of the label. */
  leading?: ReactNode;
  /** A short fact at the right, such as the next free slot. */
  trailing?: ReactNode;
};

type ListboxProps<T extends string> = {
  value: T | "";
  options: readonly ListboxOption<T>[];
  onChange: (value: T) => void;
  placeholder: string;
  /** Icon in the trigger while nothing is chosen. */
  icon?: ReactNode;
  /** Adds a search field above the options (use it for long lists of people). */
  searchable?: boolean;
  searchLabel?: string;
  /** Minimum width of the option list in px, for options with a lot to say. It never shrinks below the trigger. */
  panelWidth?: number;
  invalid?: boolean;
  /** From `Field`: wires the trigger to its label, hint and error. */
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  required?: true;
};

type Placement = { top?: number; bottom?: number; left: number; width: number; maxHeight: number };

/**
 * A select with room for people: the trigger and every option can carry an avatar, a second line and a trailing fact.
 * Replaces the native select where the choice is a person or something that needs a description. Keyboard: arrows move,
 * Enter picks, Escape closes (without closing the dialog it sits in), typing in the search field narrows the list.
 */
export function Listbox<T extends string>({
  value,
  options,
  onChange,
  placeholder,
  icon,
  searchable = false,
  searchLabel = "Search",
  panelWidth = 0,
  invalid,
  required,
  ...aria
}: ListboxProps<T>) {
  const listId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [placement, setPlacement] = useState<Placement | null>(null);

  const selected = options.find((option) => option.value === value);
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter((option) => `${option.label} ${typeof option.description === "string" ? option.description : ""}`.toLowerCase().includes(needle));
  }, [options, query]);

  const close = (restoreFocus = true) => {
    setOpen(false);
    setQuery("");
    if (restoreFocus) triggerRef.current?.focus();
  };

  const openPanel = () => {
    setActive(Math.max(0, options.findIndex((option) => option.value === value)));
    setOpen(true);
  };

  // Sit under the trigger, or above it when there is no room below. Fixed, so a scrolling dialog body never clips it.
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom - 16;
    const above = rect.top - 16;
    const flip = below < 240 && above > below;
    const room = flip ? above : below;
    const width = Math.min(Math.max(rect.width, panelWidth), window.innerWidth - 24);
    setPlacement({
      left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)),
      width,
      maxHeight: Math.min(360, room),
      ...(flip ? { bottom: window.innerHeight - rect.top + 6 } : { top: rect.bottom + 6 }),
    });
  }, [open, panelWidth]);

  useEffect(() => {
    if (!open || !placement) return;
    (searchRef.current ?? panelRef.current)?.focus();
  }, [open, placement]);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) close(false);
    };
    const onScroll = (event: Event) => {
      if (!panelRef.current?.contains(event.target as Node)) close(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open]);

  // Keep the highlighted option in view while arrowing through a long list.
  useEffect(() => {
    if (!open) return;
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, listId]);

  const choose = (option: ListboxOption<T>) => {
    onChange(option.value);
    close();
  };

  const onPanelKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      // Stop the dialog around us from treating this as "close".
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, shown.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActive(shown.length - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (shown[active]) choose(shown[active]);
    } else if (event.key === "Tab") {
      close(false);
    }
  };

  return (
    <div className="listbox" data-invalid={invalid || undefined}>
      <button
        ref={triggerRef}
        type="button"
        className="listbox-trigger"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-required={required}
        aria-controls={open ? `${listId}-panel` : undefined}
        data-placeholder={selected ? undefined : ""}
        onClick={() => (open ? close() : openPanel())}
        onKeyDown={(event) => {
          if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
            event.preventDefault();
            openPanel();
          }
        }}
        {...aria}
      >
        {selected ? (
          <>
            {selected.leading}
            <span className="listbox-value">
              <span className="listbox-label">{selected.label}</span>
              {selected.description && <span className="listbox-description">{selected.description}</span>}
            </span>
          </>
        ) : (
          <>
            {icon && <span className="listbox-icon">{icon}</span>}
            <span className="listbox-label">{placeholder}</span>
          </>
        )}
        <LuChevronDown className="listbox-chevron" aria-hidden />
      </button>

      {open && (
        <div
          ref={panelRef}
          id={`${listId}-panel`}
          className="listbox-panel"
          style={{ ...placement, visibility: placement ? "visible" : "hidden" } as CSSProperties}
          tabIndex={-1}
          onKeyDown={onPanelKey}
        >
          {searchable && (
            <label className="listbox-search">
              <LuSearch aria-hidden />
              <span className="sr-only">{searchLabel}</span>
              <input
                ref={searchRef}
                type="text"
                role="combobox"
                aria-expanded
                aria-controls={listId}
                aria-activedescendant={shown[active] ? `${listId}-${active}` : undefined}
                placeholder={searchLabel}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
              />
            </label>
          )}
          <ul
            id={listId}
            className="listbox-list"
            role="listbox"
            aria-label={placeholder}
            aria-activedescendant={!searchable && shown[active] ? `${listId}-${active}` : undefined}
          >
            {shown.map((option, index) => (
              <li
                key={option.value}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={option.value === value}
                data-active={index === active || undefined}
                onMouseMove={() => setActive(index)}
                onClick={() => choose(option)}
              >
                {option.leading}
                <span className="listbox-value">
                  <span className="listbox-label">{option.label}</span>
                  {option.description && <span className="listbox-description">{option.description}</span>}
                </span>
                {option.trailing && <span className="listbox-trailing">{option.trailing}</span>}
                {option.value === value && <LuCheck className="listbox-check" aria-hidden />}
              </li>
            ))}
            {shown.length === 0 && <li className="listbox-empty">No matches for “{query}”.</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
