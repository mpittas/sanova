"use client";

import { useState, type CSSProperties } from "react";
import { LuArrowUpRight, LuCircleCheck } from "react-icons/lu";
import { TODAY } from "@/components/appointments/data";
import { daysBetween } from "@/components/appointments/dates";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { money, type Invoice } from "./data";
import styles from "./overdue-follow-up.module.css";

/** Anything later than this sits at the far end of the ruler. */
const CAP = 30;
/** 0 to 1 along the ruler. Log scale: the first days spread out, where most invoices sit; later ones bunch up toward the end. */
// Rounded so the server and the browser print the same value (their last float digits can differ).
const position = (days: number) => Math.round((Math.log1p(Math.min(days, CAP)) / Math.log1p(CAP)) * 1e4) / 1e4;
/** Ticks sit on the lateness levels: up to 3 days, up to 2 weeks, later. */
const ticks = [{ days: 1, label: "1 day" }, { days: 3, label: "3 days" }, { days: 14, label: "2 weeks" }, { days: CAP, label: "30+" }];
const LISTED = 4;

type Props = {
  /** Overdue invoices, oldest due date first. */
  invoices: readonly Invoice[];
  onOpen: (id: string) => void;
  onReviewAll: () => void;
};

/**
 * Overdue invoices on a ruler of how late they are (one dot each, sized by amount), with the oldest listed below.
 * Pointing at a dot or a row picks out its partner.
 */
export function OverdueFollowUp({ invoices, onOpen, onReviewAll }: Props) {
  const [active, setActive] = useState<string>();
  const largest = Math.max(1, ...invoices.map((invoice) => invoice.amount));
  const placed: { p: number; lift: number }[] = [];
  const dots = invoices.map((invoice) => {
    const days = daysBetween(invoice.due, TODAY);
    const p = position(days);
    // Dots that would touch stack: centre, then above, then below.
    const lift = [0, -1, 1, -2, 2].find((row) => !placed.some((dot) => dot.lift === row && Math.abs(dot.p - p) < 0.08)) ?? 0;
    placed.push({ p, lift });
    return { invoice, days, p, lift, size: Math.round(10 + 14 * Math.sqrt(invoice.amount / largest)), level: days > 14 ? "late" : days > 3 ? "later" : "recent" };
  });

  return (
    <Card rounded className={styles.card} title="Follow-ups" description={invoices.length ? "Overdue invoices by how late they are." : "Nothing is overdue."}>
      {invoices.length ? (
        <>
          <div className={styles.ruler} role="img" aria-label={dots.map(({ invoice, days }) => `${invoice.patient}, ${days} ${days === 1 ? "day" : "days"} late`).join("; ")} onPointerLeave={() => setActive(undefined)}>
            <div className={styles.track}>
              {ticks.map((tick) => <i key={tick.days} className={styles.tick} style={{ "--p": position(tick.days) } as CSSProperties} />)}
              {dots.map(({ invoice, p, lift, size, level }) => (
                <button
                  key={invoice.id}
                  type="button"
                  tabIndex={-1}
                  aria-hidden
                  className={styles.dot}
                  data-level={level}
                  data-active={active === invoice.id || undefined}
                  data-dim={(active && active !== invoice.id) || undefined}
                  style={{ "--p": p, "--lift": lift, "--size": `${size}px` } as CSSProperties}
                  onPointerEnter={() => setActive(invoice.id)}
                  onClick={() => onOpen(invoice.id)}
                />
              ))}
            </div>
            <div className={styles.scale} aria-hidden>
              {ticks.map((tick) => <span key={tick.days} style={{ "--p": position(tick.days) } as CSSProperties}>{tick.label}</span>)}
            </div>
          </div>

          <ul className={styles.list} onPointerLeave={() => setActive(undefined)}>
            {dots.slice(0, LISTED).map(({ invoice, days, level }) => (
              <li key={invoice.id}>
                <button type="button" data-level={level} data-active={active === invoice.id || undefined} onPointerEnter={() => setActive(invoice.id)} onFocus={() => setActive(invoice.id)} onBlur={() => setActive(undefined)} onClick={() => onOpen(invoice.id)}>
                  <Avatar name={invoice.patient} size={32} />
                  <span className={styles.who}><strong>{invoice.patient}</strong><small>{days} {days === 1 ? "day" : "days"} late</small></span>
                  <b>{money(invoice.amount)}</b>
                  <LuArrowUpRight aria-hidden />
                </button>
              </li>
            ))}
          </ul>

          <button type="button" className={styles.review} onClick={onReviewAll}>
            {invoices.length > LISTED ? `Review all ${invoices.length} overdue invoices` : "Review overdue invoices"}
            <LuArrowUpRight aria-hidden />
          </button>
        </>
      ) : (
        <p className={styles.caughtUp}><LuCircleCheck aria-hidden />All caught up. Every invoice is paid or not yet due.</p>
      )}
    </Card>
  );
}
