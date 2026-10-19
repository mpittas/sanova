import { LuArrowRight, LuCircleCheck, LuTriangleAlert } from "react-icons/lu";
import { Sparkline } from "@/components/charts/sparkline";
import { Button } from "@/components/ui/button";
import { Chip, type ChipTone } from "@/components/ui/chip";
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

  return (
    <div className={styles.overview}>
      <section className={styles.hero} data-tone={tone} aria-label="Overall result">
        <div className={styles.heroText}>
          <span className={styles.resultIcon} aria-hidden>{abnormal ? <LuTriangleAlert /> : <LuCircleCheck />}</span>
          <div>
            <p className={styles.heroResult}>{title}</p>
            <p className={styles.resultSummary}>{summarize(test)}</p>
          </div>
        </div>
        <div className={styles.resultBreakdown}><span><strong>{total - abnormal}</strong> within range</span><span><strong>{abnormal}</strong> flagged</span><span><strong>{total}</strong> tested</span></div>
      </section>

      <section aria-labelledby="key-metrics-title" className={styles.metrics}>
        <header className={styles.metricsHead}>
          <h3 id="key-metrics-title" className="text-h4">
            Key markers
          </h3>
          <Button variant="ghost" size="sm" iconRight={<LuArrowRight />} onClick={onViewAll}>
            All results
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
                  <span className={styles.markerNumber}>{formatValue(parameter)}</span>
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
