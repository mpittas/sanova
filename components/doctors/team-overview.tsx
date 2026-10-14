import { Card } from "@/components/ui/card";
import { ToneTile } from "@/components/ui/tone-tile";
import { buildOverview, type Doctor } from "./data";
import styles from "./doctors.module.css";

export function TeamOverview({ doctors }: { doctors: readonly Doctor[] }) {
  return (
    <Card rounded title="Team Overview" description="Your doctors at a glance">
      <dl className={styles.overview}>
        {buildOverview(doctors).map(({ id, label, value, icon: Icon, tone }) => (
          <div key={id} className={styles.overviewTile}>
            <ToneTile tone={tone} size={44}>
              <Icon />
            </ToneTile>
            <div className={styles.overviewText}>
              <dd className="text-h3 num">{value}</dd>
              <dt className="text-small text-muted">{label}</dt>
            </div>
          </div>
        ))}
      </dl>
    </Card>
  );
}
