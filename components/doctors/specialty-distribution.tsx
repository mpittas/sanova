"use client";

import { useMemo } from "react";
import { HyperBars } from "@/components/charts/hyper-bars";
import { Card } from "@/components/ui/card";
import { buildDistribution, type Doctor } from "./data";

export function SpecialtyDistribution({ doctors }: { doctors: readonly Doctor[] }) {
  const total = doctors.length;
  const distribution = useMemo(() => buildDistribution(doctors), [doctors]);

  return (
    <Card rounded title="Specialty Distribution" description="Doctors by specialty">
      <HyperBars
        label="Doctors by specialty"
        rows={distribution.map(({ label, count, tone }) => {
          const share = total ? Math.round((count / total) * 100) : 0;
          // One brand colour for every specialty; only "Others" is greyed out.
          return { label, share, tone: tone === "neutral" ? "neutral" : "primary", detail: count, value: `${share}%` };
        })}
      />
    </Card>
  );
}
