import { LuArrowUpRight } from "react-icons/lu";
import { Card } from "@/components/ui/card";
import { ToneTile } from "@/components/ui/tone-tile";
import { quickActions } from "./data";
import styles from "./dashboard.module.css";

export function QuickActions() {
  return (
    <Card title="Quick Actions" description="Common tasks">
      <div className={styles.actions}>
        {quickActions.map(({ label, icon: Icon, tone }) => (
          <button key={label} type="button" className={styles.action} data-tone={tone}>
            <ToneTile tone={tone} size={38}>
              <Icon />
            </ToneTile>
            <span className={styles.actionLabel}>{label}</span>
            <LuArrowUpRight className={styles.actionArrow} aria-hidden />
          </button>
        ))}
      </div>
    </Card>
  );
}
