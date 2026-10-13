import type { ComponentPropsWithoutRef, ReactNode } from "react";

type CardProps = Omit<ComponentPropsWithoutRef<"section">, "title"> & {
  title?: ReactNode;
  /** Muted line under the title. */
  description?: ReactNode;
  /** Rendered at the right of the header (select, link, ...). */
  action?: ReactNode;
};

export function Card({ title, description, action, className, children, ...rest }: CardProps) {
  return (
    <section className={["card", className].filter(Boolean).join(" ")} {...rest}>
      {(title || action) && (
        <header className="card-header">
          <div className="card-heading">
            {title && <h2 className="text-h4">{title}</h2>}
            {description && <p className="text-small text-muted">{description}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
