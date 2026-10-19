import { useId, type ReactNode } from "react";
import { Card } from "./card";
import { ToneTile, type Tone } from "./tone-tile";

type SettingsGroupProps = {
  title: string;
  /** One muted line under the title. */
  description?: string;
  /** An icon shown in a tinted tile beside the title. */
  icon?: ReactNode;
  tone?: Tone;
  /** A hint on the left of the footer ("Changes apply straight away"). */
  note?: ReactNode;
  /** Sits under the rows, separated by a hairline: a Save button. */
  footer?: ReactNode;
  children: ReactNode;
};

/** A card of `SettingRow`s with its icon, title and description in a header band. */
export function SettingsGroup({ title, description, icon, tone = "primary", note, footer, children }: SettingsGroupProps) {
  const titleId = useId();
  return (
    <section className="settings-group" aria-labelledby={titleId}>
      <Card padding="none">
        <header className="settings-group-head">
          {icon && (
            <ToneTile tone={tone} size={40}>
              {icon}
            </ToneTile>
          )}
          <div className="settings-group-title">
            <h2 id={titleId} className="text-h4">
              {title}
            </h2>
            {description && <p className="text-small text-muted">{description}</p>}
          </div>
        </header>
        <div className="setting-list">{children}</div>
        {(footer || note) && (
          <footer className="setting-footer">
            {note && <p className="setting-note text-small text-muted">{note}</p>}
            {footer}
          </footer>
        )}
      </Card>
    </section>
  );
}

/** Props to spread onto the control inside a `SettingRow`, so the row's title labels it. */
export type SettingControlProps = { id: string; "aria-describedby"?: string };

type SettingRowProps = {
  title: ReactNode;
  description?: ReactNode;
  /** `field` gives the control a fixed 280px column for inputs and selects; `inline` (default) fits switches, buttons and chips. */
  control?: "inline" | "field";
  /** The control. Pass a function to receive the `id` and ARIA props that tie the title to it. */
  children: ReactNode | ((control: SettingControlProps) => ReactNode);
};

/** One setting: its name and a line of help on the left, the control on the right. Stacks on a narrow screen. */
export function SettingRow({ title, description, control = "inline", children }: SettingRowProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const isFunction = typeof children === "function";

  return (
    <div className="setting-row">
      <div className="setting-row-text">
        {isFunction ? (
          <label className="text-label" htmlFor={id}>
            {title}
          </label>
        ) : (
          <p className="text-label">{title}</p>
        )}
        {description && (
          <p id={hintId} className="text-small text-muted">
            {description}
          </p>
        )}
      </div>
      <div className="setting-row-control" data-control={control}>
        {isFunction ? children({ id, "aria-describedby": description ? hintId : undefined }) : children}
      </div>
    </div>
  );
}
