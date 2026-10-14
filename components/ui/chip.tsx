import type { ComponentPropsWithoutRef } from "react";

export type ChipTone = "success" | "info" | "neutral" | "warning" | "danger" | "violet";

type ChipProps = ComponentPropsWithoutRef<"span"> & {
  tone?: ChipTone;
  /** `status` has a leading dot and is fully round; `tag` is a squarer label without a dot. */
  variant?: "status" | "tag";
  size?: "md" | "sm";
};

/** Small coloured label: statuses ("Active"), tags ("In Person"), roles ("Care Team"). */
export function Chip({ tone = "neutral", variant = "status", size = "md", className, ...rest }: ChipProps) {
  const classes = ["chip", `chip-${tone}`, variant === "tag" && "chip-tag", size === "sm" && "chip-sm", className]
    .filter(Boolean)
    .join(" ");
  return <span className={classes} {...rest} />;
}
