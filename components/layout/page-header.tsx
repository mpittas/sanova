import type { ReactNode } from "react";

/** Title block at the top of every page, with optional eyebrow above and actions on the right. */
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
        <h1 className="text-h1">{title}</h1>
        {description && <p className="text-body-lg text-muted">{description}</p>}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
}
