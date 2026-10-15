import type { ReactNode } from "react";
import type { IconType } from "react-icons";

/** Icon-led facts about one thing: when, how long, where, notes. Used in the side panels of Appointments and Telemedicine. */
export function DetailList({ children, className }: { children: ReactNode; className?: string }) {
  return <ul className={["detail-list", className].filter(Boolean).join(" ")}>{children}</ul>;
}

export function DetailItem({
  icon: Icon,
  title,
  children,
}: {
  icon: IconType;
  /** Bold line above the content (a visit type, "Notes"). Items with a title align to the top. */
  title?: ReactNode;
  children: ReactNode;
}) {
  return (
    <li data-top={title ? "" : undefined}>
      <Icon aria-hidden />
      <span>
        {title && <span className="detail-title">{title}</span>}
        {title ? <span className="text-muted">{children}</span> : children}
      </span>
    </li>
  );
}
