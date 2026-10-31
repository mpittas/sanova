import { LuInfo } from "react-icons/lu";
import type { ReactNode } from "react";

/** Title block at the top of every page: a plain title and one muted line, with optional eyebrow above and actions on the right. */
export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
}: {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div className="page-header-text">
        {eyebrow}
        <div className="page-header-heading"><h1 className="page-header-title">{title}</h1>
          {description && <span className="page-header-info"><button type="button" aria-label="About this page"><LuInfo aria-hidden /></button><span role="tooltip">{description}</span></span>}
        </div>
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
}
