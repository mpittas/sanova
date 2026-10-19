"use client";

import { useRef } from "react";
import { LuChevronDown, LuMessageSquare, LuPrinter } from "react-icons/lu";
import { formatDate } from "@/components/appointments/dates";
import { doctorByName } from "@/components/doctors/data";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { ToneTile } from "@/components/ui/tone-tile";
import { statusOfTest, testStatusMeta, type LabTest } from "./data";
import styles from "./lab-results.module.css";
import { TestOverview } from "./test-overview";
import { TestResults } from "./test-results";
import { TestTrends } from "./test-trends";

function Comments({ test }: { test: LabTest }) {
  if (test.comments.length === 0) {
    return <EmptyState icon={LuMessageSquare} size="compact" title="No comments yet" description="Notes from the care team will appear here." />;
  }
  return (
    <ul className={styles.comments}>
      {test.comments.map(({ author, when, text }) => (
        <li key={`${author}-${when}`}>
          <Avatar name={author} src={doctorByName(author)?.photo} size={40} />
          <div className={styles.commentText}>
            <p>
              <span className="text-label">{author}</span> <span className="text-small text-muted">• {formatDate(when, { month: "short", day: "numeric", year: "numeric" })}</span>
            </p>
            <p className="text-body">{text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function LabTestDetail({ test }: { test: LabTest }) {
  const resultsRef = useRef<HTMLElement>(null);
  const result = statusOfTest(test);
  const Icon = test.icon;

  return (
    <Card rounded padding="none" className={styles.detail}>
      <div className={styles.reportBar}><span>Lab report</span><Button variant="ghost" size="sm" iconLeft={<LuPrinter />} onClick={() => window.print()}>Print</Button></div>
      <header className={styles.detailHead}>
        <ToneTile tone={test.tone} size={44}>
          <Icon />
        </ToneTile>
        <div className={styles.detailTitle}>
          <h2>{test.name}</h2>
          <p className="text-small text-muted">
            {formatDate(test.date, { month: "short", day: "numeric", year: "numeric" })} · {test.parameters.length} {test.parameters.length === 1 ? "marker" : "markers"}
          </p>
        </div>
        <Chip tone={testStatusMeta[result].chip} variant="tag" size="sm">{result}</Chip>
      </header>
      <div className={styles.panel}>
        <TestOverview test={test} onViewAll={() => resultsRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" })} />
        <section ref={resultsRef} className={styles.resultsSection} aria-label="All results"><div className={styles.sectionHeading}><h3>All results</h3><span>{test.parameters.length} {test.parameters.length === 1 ? "marker" : "markers"}</span></div><TestResults test={test} /></section>
        <details className={styles.disclosure}><summary>Trends over time<LuChevronDown aria-hidden /></summary><div><TestTrends test={test} /></div></details>
        <details className={styles.disclosure}><summary>Care-team notes<span>{test.comments.length}<LuChevronDown aria-hidden /></span></summary><div><Comments test={test} /></div></details>
        <div className={styles.orderedBy}><Avatar name={test.orderedBy} src={doctorByName(test.orderedBy)?.photo} size={30} /><div><span>Ordered by</span><strong>{test.orderedBy}</strong></div></div>
      </div>
    </Card>
  );
}
