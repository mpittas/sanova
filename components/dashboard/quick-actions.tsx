import { ActionGrid, ActionTile } from "@/components/ui/action-tile";
import { Card } from "@/components/ui/card";
import { quickActions } from "./data";

export function QuickActions() {
  return (
    <Card title="Quick Actions" description="Common tasks">
      <ActionGrid>
        {quickActions.map(({ label, icon: Icon, tone }) => (
          <ActionTile key={label} label={label} icon={<Icon />} tone={tone} />
        ))}
      </ActionGrid>
    </Card>
  );
}
