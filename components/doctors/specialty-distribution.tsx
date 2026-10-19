"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { palette } from "@/lib/tokens";
import { buildDistribution, type Doctor } from "./data";
import styles from "./doctors.module.css";

/** One bar split by specialty, with a legend below. Hovering a row spotlights its slice. */
export function SpecialtyDistribution({ doctors }: { doctors: readonly Doctor[] }) {
  const [active, setActive] = useState<string | null>(null);
  const total = doctors.length;
  const slices = useMemo(
    () => buildDistribution(doctors).filter(({ count }) => count > 0),
    [doctors],
  );
  const colour = (tone: string) => (tone === "neutral" ? palette.neutral[400] : palette[tone as keyof typeof palette][500]);

  return (
    <Card rounded title="Specialty Distribution" description="Doctors by specialty">
      <div className={styles.strip2} role="img" aria-label="Doctors by specialty">
        {slices.map(({ label, count, tone }) => (
          <span
            key={label}
            style={{ flexGrow: count, backgroundColor: colour(tone) }}
            data-dim={active !== null && active !== label ? "" : undefined}
          />
        ))}
      </div>
      <ul className={styles.legend2} onMouseLeave={() => setActive(null)}>
        {slices.map(({ label, count, tone }) => (
          <li
            key={label}
            data-dim={active !== null && active !== label ? "" : undefined}
            onMouseEnter={() => setActive(label)}
          >
            <span className={styles.swatch} style={{ backgroundColor: colour(tone) }} aria-hidden />
            <span className="text-label">{label}</span>
            <span className={styles.legendCount}>{count}</span>
            <span className={styles.legendShare}>{total ? Math.round((count / total) * 100) : 0}%</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
