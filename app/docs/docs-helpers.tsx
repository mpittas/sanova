import type { ReactNode } from "react";
import styles from "./docs.module.css";

/** A documented component: anchor, title, one-line description and where to import it from. */
export function DocSection({
  id,
  title,
  description,
  source,
  children,
}: {
  id: string;
  title: string;
  description: ReactNode;
  /** Import path, shown under the description. */
  source?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className="text-h2">{title}</h2>
        <p className="text-body text-muted">{description}</p>
        {source && (
          <p className="text-caption text-muted">
            Import from <code className="mono">{source}</code>
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

export function Panel({ title, note, children }: { title?: string; note?: ReactNode; children: ReactNode }) {
  return (
    <div className={styles.panel}>
      {title && <h3 className="text-h4">{title}</h3>}
      {children}
      {note && <p className="text-caption text-muted">{note}</p>}
    </div>
  );
}

/** Table of variants: a code label on the left, the live component(s) on the right. */
export function Specimens({ children }: { children: ReactNode }) {
  return <div className={styles.specimens}>{children}</div>;
}

export function Specimen({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className={styles.specimen}>
      <div className={styles.specimenMeta}>
        <code className="mono text-label">{label}</code>
        {hint && <span className="text-caption text-muted">{hint}</span>}
      </div>
      <div className={styles.specimenItems}>{children}</div>
    </div>
  );
}

export function CodeBlock({ children }: { children: string }) {
  return (
    <pre className={styles.code}>
      <code>{children}</code>
    </pre>
  );
}
