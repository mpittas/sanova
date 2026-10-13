import { LuArrowUp } from "react-icons/lu";
import { Sparkline } from "@/components/charts/sparkline";
import { Card } from "@/components/ui/card";
import { ToneTile } from "@/components/ui/tone-tile";
import { palette } from "@/lib/tokens";
import { stats } from "./data";
import styles from "./dashboard.module.css";

export function StatCards() {
  return (
    <div className={styles.stats}>
      {stats.map(({ id, label, value, change, period, icon: Icon, tone, trend }) => (
        <Card key={id} className={styles.statCard}>
          <div className={styles.statTop}>
            <p className="text-label text-muted">{label}</p>
            <ToneTile tone={tone} size={36}>
              <Icon />
            </ToneTile>
          </div>
          <p className={`text-stat num ${styles.statValue}`}>{value}</p>
          <p className={styles.statMeta}>
            <span className={styles.deltaChip}>
              <LuArrowUp aria-hidden />
              <span className="sr-only">Up </span>
              {change}
            </span>
            <span className="text-small text-muted">{period}</span>
          </p>
          <div className={styles.spark}>
            <Sparkline name={label} data={trend} color={palette[tone][500]} />
          </div>
        </Card>
      ))}
    </div>
  );
}
