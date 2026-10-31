import type { CSSProperties } from "react";
import { LuArrowDownRight, LuArrowUpRight } from "react-icons/lu";
import { Card } from "@/components/ui/card";
import { CountUp } from "@/components/ui/count-up";
import { money } from "./data";
import styles from "./billing-summary.module.css";

/** How many slivers the meter is cut into. Each one stands for the same share of the billed total. */
const SLIVERS = 48;

type Amount = { cents: number; count: number };

type Props = {
  billed: Amount;
  collected: Amount;
  /** Every unpaid invoice, overdue ones included. */
  outstanding: Amount;
  overdue: Amount & { oldestDays?: number };
  /** Billed to insurers; the rest is billed to patients. */
  insurance: number;
  /** The same span of time just before this one, e.g. `{ cents, label: "previous 30 days" }`. Leave out for all time. */
  previous?: { cents: number; label: string };
};

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;
const percent = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);

/** Splits the meter between collected, open (not yet due) and overdue, giving every non-zero amount at least one sliver. */
function slivers(total: number, collected: number, overdue: number) {
  if (!total) return { paid: 0, open: 0, overdue: 0 };
  const share = (cents: number) => (cents ? Math.max(1, Math.round((cents / total) * SLIVERS)) : 0);
  const paid = Math.min(share(collected), SLIVERS);
  const late = Math.min(share(overdue), SLIVERS - paid);
  return { paid, open: SLIVERS - paid - late, overdue: late };
}

/**
 * Billing overview: the billed total on the brand surface, then how it splits into collected, outstanding and overdue.
 * The meter shows the same money as 48 equal slivers, with a dimension line under each part giving its share.
 * Point at a figure to pick out its slivers, or at the slivers to pick out the figure.
 */
export function BillingSummary({ billed, collected, outstanding, overdue, insurance, previous }: Props) {
  const total = billed.cents;
  const counts = slivers(total, collected.cents, overdue.cents);
  const kinds = Array.from({ length: SLIVERS }, (_, index) => (!total ? "empty" : index < counts.paid ? "paid" : index < counts.paid + counts.open ? "open" : "overdue"));
  const segments = [
    { kind: "paid", span: counts.paid, share: percent(collected.cents, total), name: "collected" },
    { kind: "open", span: counts.open, share: percent(outstanding.cents - overdue.cents, total), name: "not yet due" },
    { kind: "overdue", span: counts.overdue, share: percent(overdue.cents, total), name: "overdue" },
  ].filter((segment) => segment.span > 0);
  const change = previous?.cents ? percent(total - previous.cents, previous.cents) : undefined;
  const patients = total - insurance;

  return (
    <Card rounded padding="none" className={styles.summary}>
      <div className={styles.total}>
        <div className={styles.totalTop}>
          <p className={styles.totalLabel}>Total billed</p>
          {change !== undefined && (
            <span className={styles.change}>
              {change < 0 ? <LuArrowDownRight aria-hidden /> : <LuArrowUpRight aria-hidden />}
              <span className="sr-only">{change < 0 ? "Down" : "Up"} </span>
              {Math.abs(change)}%
            </span>
          )}
        </div>
        <p className={styles.totalFigure}><CountUp value={money(total)} /></p>
        <p className={styles.totalCaption}>
          {plural(billed.count, "invoice", "invoices")} issued
          {change !== undefined && previous && <>, against {money(previous.cents)} in the {previous.label}</>}
        </p>

        {total > 0 && (
          <div className={styles.payers}>
            <dl>
              <div><dt><i />Insurance</dt><dd>{money(insurance)}</dd></div>
              <div><dt><i />Patients</dt><dd>{money(patients)}</dd></div>
            </dl>
            <p className={styles.payerBar} role="img" aria-label={`${percent(insurance, total)}% billed to insurance, ${percent(patients, total)}% to patients`}>
              <span style={{ flexGrow: insurance }} />
              <span style={{ flexGrow: patients }} />
            </p>
          </div>
        )}
      </div>

      <div className={styles.split}>
        <div className={styles.parts}>
          <div className={styles.part} data-kind="paid">
            <p className={styles.partLabel}><i />Collected</p>
            <p className={styles.partFigure}><CountUp value={money(collected.cents)} /></p>
            <p className={styles.partCaption}>{plural(collected.count, "invoice", "invoices")} paid</p>
          </div>
          <div className={styles.part} data-kind="outstanding">
            <p className={styles.partLabel}><i />Outstanding</p>
            <p className={styles.partFigure}><CountUp value={money(outstanding.cents)} /></p>
            <p className={styles.partCaption}>{!outstanding.count ? "No open invoices" : !overdue.count ? `${plural(outstanding.count, "invoice", "invoices")} open, none late` : `${overdue.count} of ${plural(outstanding.count, "open invoice", "open invoices")} late`}</p>
          </div>
          <div className={styles.part} data-kind="overdue">
            <p className={styles.partLabel}><i />Overdue</p>
            <p className={styles.partFigure}><CountUp value={money(overdue.cents)} /></p>
            <p className={styles.partCaption}>{overdue.oldestDays === undefined ? "Nothing past due" : `Oldest is ${plural(overdue.oldestDays, "day", "days")} late`}</p>
          </div>
        </div>

        <div className={styles.meter} role="img" aria-label={total ? segments.map((segment) => `${segment.share}% ${segment.name}`).join(", ") : "Nothing billed in this period"}>
          <div className={styles.slivers} aria-hidden>
            {kinds.map((kind, index) => <i key={index} data-kind={kind} style={{ "--i": index } as CSSProperties} />)}
          </div>
          {/* Same 48-column grid as the slivers, so each line starts and ends exactly on its part. */}
          <div className={styles.dimensions} aria-hidden>
            {segments.map((segment) => (
              <span key={segment.kind} data-kind={segment.kind} data-narrow={segment.span < 4 || undefined} style={{ gridColumn: `span ${segment.span}` }}>
                <b>{segment.share}%</b>
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
