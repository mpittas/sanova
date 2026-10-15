import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ToneTile } from "@/components/ui/tone-tile";
import { departmentByName, updates } from "./data";
import styles from "./departments.module.css";

export function RecentUpdates() {
  return (
    <Card
      rounded
      title="Recent Department Updates"
      action={
        <Button variant="ghost" size="sm">
          View All
        </Button>
      }
    >
      <ul className={styles.updates}>
        {updates.map(({ id, department, message, when }) => {
          const { tone, icon: Icon } = departmentByName(department);
          return (
            <li key={id}>
              <ToneTile tone={tone} size={44}>
                <Icon />
              </ToneTile>
              <span className="text-stack">
                <span className="text-label">{department}</span>
                <span className="text-small text-muted">{message}</span>
              </span>
              <span className="text-small text-muted">{when}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
