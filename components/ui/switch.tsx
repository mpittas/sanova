import type { ComponentPropsWithoutRef } from "react";

type SwitchProps = Omit<ComponentPropsWithoutRef<"input">, "type" | "role">;

/** On/off toggle for a setting that takes effect immediately. Label it with a `<label>` or `aria-label`; for choices that wait for a Save button use a `Checkbox`. */
export function Switch({ className, ...rest }: SwitchProps) {
  return <input type="checkbox" role="switch" className={["switch", className].filter(Boolean).join(" ")} {...rest} />;
}
