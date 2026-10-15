import type { ReactNode } from "react";
import { Avatar } from "./avatar";

type PersonProps = {
  name: string;
  /** Line under the name: an MRN, a visit type, a role. */
  subtitle?: ReactNode;
  /** Portrait URL. Defaults to the sample portrait registered for `name`. */
  src?: string;
  size?: number;
  online?: boolean;
  className?: string;
};

/** A person in a list or table row: avatar, name and one line of detail. Long text truncates. */
export function Person({ name, subtitle, src, size = 40, online, className }: PersonProps) {
  return (
    <span className={["person", className].filter(Boolean).join(" ")}>
      <Avatar name={name} src={src} size={size} online={online} />
      <span className="text-stack">
        <span className="text-label person-name">{name}</span>
        {subtitle && <span className="text-small text-muted person-subtitle">{subtitle}</span>}
      </span>
    </span>
  );
}
