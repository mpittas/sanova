"use client";

import type { ComponentPropsWithoutRef } from "react";

type CheckboxProps = Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  /** Shows the "some selected" dash. Only visual: pair it with `checked` for the real state. */
  indeterminate?: boolean;
};

export function Checkbox({ indeterminate = false, className, ...rest }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={["checkbox", className].filter(Boolean).join(" ")}
      ref={(element) => {
        if (element) element.indeterminate = indeterminate;
      }}
      {...rest}
    />
  );
}
