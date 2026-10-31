import type { CSSProperties } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { CountUp } from "@/components/ui/count-up";
import { Delta } from "@/components/ui/delta";
import { StatGrid } from "@/components/ui/stat-tile";
import { patients, patientStats, type Patient } from "./data";
import styles from "./patients.module.css";

const TILE = 54;

const members: Record<string, (patient: Patient) => boolean> = {
  total: () => true,
  active: (patient) => patient.status === "Active",
  new: (patient) => patient.isNew,
  risk: (patient) => patient.status === "At Risk",
};

/**
 * The four figures with the people behind them: a 2 x 2 block of round portraits that touch each other.
 * The last photo carries the count of everyone else.
 */
export function PatientStats() {
  return (
    <StatGrid>
      {patientStats.map(({ id, label, value, change, period, icon: Icon, tone, deltaTone }) => {
        const matching = patients.filter(members[id]);
        const share = Math.round((matching.length / patients.length) * 100);
        const faces = matching.slice(0, 4);
        const more = matching.length - faces.length;

        return (
          <Card key={id} className={styles.roster} data-tone={tone}>
            <p className={styles.rosterLabel}>
              <Icon aria-hidden />
              <span className="text-label">{label}</span>
            </p>
            <div className={styles.rosterBody}>
              <div className={styles.rosterText}>
                <p className={styles.rosterFigure}>
                  <CountUp value={String(value)} />
                </p>
                <p className={styles.rosterCaption}>{id === "total" ? "on the register" : `${share}% of all`}</p>
                <span className={styles.rosterDelta}>
                  <Delta value={change ?? ""} tone={deltaTone} variant="chip" />
                  <span className="sr-only">{period}</span>
                </span>
              </div>
              <div className={styles.quilt} role="group" aria-label={`${label}: ${faces.map((patient) => patient.name).join(", ")}${more > 0 ? ` and ${more} more` : ""}`}>
                {faces.map((patient, index) => (
                  <span key={patient.id} className={styles.tile} title={patient.name} style={{ "--i": index } as CSSProperties}>
                    <Avatar name={patient.name} src={patient.photo} size={TILE} />
                    {more > 0 && index === faces.length - 1 && <span className={styles.tileCount}>+{more}</span>}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        );
      })}
    </StatGrid>
  );
}
