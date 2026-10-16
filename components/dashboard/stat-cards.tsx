import { HyperSparkBars } from "@/components/charts/hyper-spark-bars";
import { Card } from "@/components/ui/card";
import { CountUp } from "@/components/ui/count-up";
import { Delta } from "@/components/ui/delta";
import { ToneTile } from "@/components/ui/tone-tile";
import { stats } from "./data";
import styles from "./dashboard.module.css";

// Every KPI card uses the brand green, so the row reads as one set.
const tone = "primary";

export function StatCards() {
  return (
    <div className={styles.stats}>
      {stats.map(({ id, label, value, change, period, icon: Icon, trend }) => (
        <Card key={id} className={styles.statCard} data-tone={tone}>
          <div className={styles.statHeader}>
            <p className={styles.statLabel}>{label}</p>
            <ToneTile tone={tone} size={40}>
              <Icon />
            </ToneTile>
          </div>
          <p className={`num ${styles.statValue}`}>
            <CountUp value={value} />
          </p>
          <p className={styles.statMeta}>
            <Delta value={change} />
            <span className="text-small text-muted">{period}</span>
          </p>
          <div className={styles.spark}>
            <HyperSparkBars name={label} data={trend} tone={tone} />
          </div>
        </Card>
      ))}
    </div>
  );
}
