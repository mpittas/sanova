import type { ReactNode } from "react";
import type { IconType } from "react-icons";

/** Shown in place of a list/table/chat that has nothing to display. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  size = "md",
}: {
  icon: IconType;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  size?: "md" | "compact";
}) {
  return (
    <div className={size === "compact" ? "empty-state empty-state-compact" : "empty-state"}>
      <Icon aria-hidden />
      <p className="text-label">{title}</p>
      {description && <p className="text-small text-muted">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}
