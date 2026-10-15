import { Card } from "@/components/ui/card";
import { InfoGrid, InfoTile } from "@/components/ui/info-tile";
import { buildOverview, type Doctor } from "./data";

export function TeamOverview({ doctors }: { doctors: readonly Doctor[] }) {
  return (
    <Card rounded title="Team Overview" description="Your doctors at a glance">
      <InfoGrid>
        {buildOverview(doctors).map(({ id, ...tile }) => (
          <InfoTile key={id} {...tile} />
        ))}
      </InfoGrid>
    </Card>
  );
}
