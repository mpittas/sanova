import { StatGrid, StatTile } from "@/components/ui/stat-tile";
import { stats } from "./data";

export function StatCards() {
  return (
    <StatGrid>
      {stats.map(({ id, label, value, change, period, icon, tone, trend }) => (
        <StatTile
          key={id}
          label={label}
          value={value}
          change={change}
          period={period}
          icon={icon}
          tone={tone}
          trend={trend}
          countUp
        />
      ))}
    </StatGrid>
  );
}
