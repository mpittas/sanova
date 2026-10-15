import { LuArrowRight, LuCircleCheck, LuClipboardList, LuTrendingUp, LuTriangleAlert } from "react-icons/lu";
import { Sparkline } from "@/components/charts/sparkline";
import { Button } from "@/components/ui/button";
import { Chip, type ChipTone } from "@/components/ui/chip";
import { InfoGrid, InfoTile } from "@/components/ui/info-tile";
import { ToneTile } from "@/components/ui/tone-tile";
import { palette } from "@/lib/tokens";
import {
  abnormalParameters,
  formatRange,
  formatValue,
  historyOf,
  keyMetrics,
  statusOf,
  statusOfTest,
  summarize,
  testStatusMeta,
  type LabTest,
  type ParameterStatus,
} from "./data";
import styles from "./lab-results.module.css";

const parameterChip: Record<ParameterStatus, ChipTone> = { Normal: "success", High: "warning", Low: "danger" };
const sparkColor: Record<ParameterStatus, string> = { Normal: palette.primary[500], High: palette.amber[500], Low: palette.coral[500] };

export function TestOverview({ test, onViewAll }: { test: LabTest; onViewAll: () => void }) {
  const result = statusOfTest(test);
  const { tone, title } = testStatusMeta[result];
  const abnormal = abnormalParameters(test).length;
  const total = test.parameters.length;

  const tiles = [
    { id: "tested", label: "Parameters Tested", value: total, icon: LuClipboardList, tone: "blue" },
    { id: "normal", label: "Within Normal Range", value: total - abnormal, icon: LuCircleCheck, tone: "success" },
    { id: "abnormal", label: "Abnormal Values", value: abnormal, icon: LuTriangleAlert, tone: "amber" },
  ] as const;

  return (
    <div className={styles.overview}>
      <section className={`banner-surface banner-surface-sm grain ${styles.hero}`} data-tone={tone} aria-label="Overall result">
        <div className={styles.heroText}>
          <ToneTile tone={tone} size={48}>
            <LuTrendingUp />
          </ToneTile>
          <div>
            <p className="text-label">Overall Result</p>
            <p className={`text-h1 ${styles.heroResult}`}>{title}</p>
            <p className="text-body text-muted">{summarize(test)}</p>
          </div>
        </div>

        {/* Decorative blood cells. */}
        <div className={styles.cells} aria-hidden>
          <span />
          <span />
          <span />
        </div>
      </section>

      <InfoGrid aria-label="Result summary">
        {tiles.map(({ id, ...tile }) => (
          <InfoTile key={id} {...tile} />
        ))}
      </InfoGrid>

      <section aria-labelledby="key-metrics-title" className={styles.metrics}>
        <header className={styles.metricsHead}>
          <h3 id="key-metrics-title" className="text-h4">
            Key Metrics
          </h3>
          <Button variant="ghost" size="sm" iconRight={<LuArrowRight />} onClick={onViewAll}>
            View All Results
          </Button>
        </header>

        <ul className={styles.metricGrid}>
          {keyMetrics(test).map((parameter, index) => {
            const status = statusOf(parameter);
            return (
              <li key={parameter.name} className={styles.metric} data-status={status}>
                <div className={styles.metricTop}>
                  <p className="text-small text-muted">{parameter.name}</p>
                  <Chip tone={parameterChip[status]} variant="tag" size="sm">
                    {status}
                  </Chip>
                </div>
                <p className={styles.metricValue}>
                  <span className="text-h2 num">{formatValue(parameter)}</span>
                  <span className="text-small text-muted">{parameter.unit}</span>
                </p>
                <p className="text-small text-muted num">{formatRange(parameter)}</p>
                <div className={styles.spark}>
                  <Sparkline name={parameter.name} data={historyOf(parameter, index + test.id.length)} color={sparkColor[status]} height={56} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
