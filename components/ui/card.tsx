import type { ComponentPropsWithoutRef, ReactNode } from "react";

type CardProps = Omit<ComponentPropsWithoutRef<"section">, "title"> & {
  title?: ReactNode;
  /** Muted line under the title. */
  description?: ReactNode;
  /** Rendered at the right of the header (select, link, ...). */
  action?: ReactNode;
  /** `none` is for content that runs edge to edge (tables, lists, chat). */
  padding?: "md" | "lg" | "none";
  /** Extra-soft 24px corners, for feature surfaces and profile-style cards. */
  rounded?: boolean;
};

export function Card({ title, description, action, padding = "md", rounded = false, className, children, ...rest }: CardProps) {
  const classes = ["card", padding !== "md" && `card-pad-${padding}`, rounded && "card-round", className]
    .filter(Boolean)
    .join(" ");
  return (
    <section className={classes} {...rest}>
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
