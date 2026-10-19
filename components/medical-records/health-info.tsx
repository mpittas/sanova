import { LuHeart, LuPill, LuSprout, LuWind } from "react-icons/lu";
import { healthFacts } from "@/components/patient-record/data";
import { Card } from "@/components/ui/card";
import { ToneTile } from "@/components/ui/tone-tile";
import styles from "./medical-records.module.css";

const icons = { heart: LuHeart, allergy: LuSprout, lungs: LuWind, pill: LuPill };

/** Three vitals as tinted tiles: the value first, its label under it. */
export function HealthInfo() {
  return (
    <Card rounded title="Health summary" description="Key information for this patient">
      <dl className={styles.healthFacts}>
        {healthFacts
          .filter((fact) => fact.id !== "allergies")
          .map(({ id, value, label, icon, tone }) => {
            const Icon = icons[icon];
            return (
              <div key={id} data-tone={tone} data-wide={id === "medications" ? "" : undefined}>
                <ToneTile tone={tone} size={32}>
                  <Icon />
                </ToneTile>
                <dd>{value}</dd>
                <dt>{label}</dt>
              </div>
            );
          })}
      </dl>
    </Card>
  );
}
