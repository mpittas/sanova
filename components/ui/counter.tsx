import type { ComponentPropsWithoutRef } from "react";

type CounterProps = ComponentPropsWithoutRef<"span"> & {
  tone?: "primary" | "soft" | "danger" | "neutral";
  size?: "md" | "sm";
};

/** Tiny round number badge: unread messages, applied filters, menu counts. */
export function Counter({ tone = "primary", size = "md", className, ...rest }: CounterProps) {
  const classes = ["counter", `counter-${tone}`, size === "sm" && "counter-sm", className].filter(Boolean).join(" ");
  return <span className={classes} {...rest} />;
}
