import type { ReactNode } from "react";

/** The padded, centred `<main>` wrapper every page renders its content in. */
export function PageContent({ children }: { children: ReactNode }) {
  return <main className="page-content">{children}</main>;
}
