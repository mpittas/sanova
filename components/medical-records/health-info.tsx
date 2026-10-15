import { LuHeart, LuPill, LuSprout, LuWind } from "react-icons/lu";
import { healthFacts } from "@/components/patient-record/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InfoGrid, InfoTile } from "@/components/ui/info-tile";

const icons = { heart: LuHeart, allergy: LuSprout, lungs: LuWind, pill: LuPill };

export function HealthInfo() {
  return (
    <Card
      rounded
      title="Key Health Information"
      action={
        <Button variant="secondary" size="sm">
          Edit
        </Button>
      }
    >
      <InfoGrid columns={2}>
        {healthFacts.map(({ id, value, label, icon, tone }) => (
          <InfoTile key={id} variant="fact" label={label} value={value} icon={icons[icon]} tone={tone} />
        ))}
      </InfoGrid>
    </Card>
  );
}
