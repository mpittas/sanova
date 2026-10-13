import { StatGrid, StatTile } from "@/components/ui/stat-tile";
import { stats } from "./data";

export function AppointmentStats() {
  return (
    <StatGrid>
      {stats.map(({ id, ...stat }) => (
        <StatTile key={id} {...stat} />
      ))}
    </StatGrid>
  );
}
