import type { ReactNode } from "react";

type PageBannerProps = {
  title: ReactNode;
  description?: ReactNode;
  /** Small label above the title. */
  eyebrow?: ReactNode;
  /** Right-hand illustration, standing on the bottom edge of the banner (an `ArchLineup`). Hidden on narrow screens. */
  visual?: ReactNode;
  className?: string;
};

/** The soft green welcome banner under a page's title: a short pitch on the left and an illustration on the right. */
export function PageBanner({ title, description, eyebrow, visual, className }: PageBannerProps) {
  return (
    <section className={["banner-surface", "grain", "page-banner", className].filter(Boolean).join(" ")}>
      <div className="page-banner-text">
        {eyebrow && <p className="text-label page-banner-eyebrow">{eyebrow}</p>}
        <h2 className="text-h2 banner-title">{title}</h2>
        {description && <p className="text-body-lg banner-text">{description}</p>}
      </div>
      {visual && (
        <div className="page-banner-visual" aria-hidden>
          {visual}
        </div>
      )}
    </section>
  );
}

type ArchLineupProps = {
  /** Portrait URLs, two or three. */
  photos: readonly string[];
  /** Floating details laid over the portraits (a badge, a chip). Position them absolutely. */
  children?: ReactNode;
};

/** Portraits standing on the bottom edge of a `PageBanner` inside arched frames, each a different height and tint. */
export function ArchLineup({ photos, children }: ArchLineupProps) {
  return (
    <div className="arch-lineup" data-count={photos.length}>
      {photos.map((photo) => (
        <span key={photo} className="arch">
          {/* Small remote portraits: a plain <img> avoids image-optimizer setup for placeholder photos. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="" width={160} height={160} referrerPolicy="no-referrer" />
        </span>
      ))}
      {children}
    </div>
  );
}
