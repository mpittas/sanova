"use client";

import { useState } from "react";
import { LuMessageSquare } from "react-icons/lu";
import { formatDate } from "@/components/appointments/dates";
import { doctorByName } from "@/components/doctors/data";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { tabId, Tabs } from "@/components/ui/tabs";
import { ToneTile } from "@/components/ui/tone-tile";
import { detailTabs, statusOfTest, testStatusMeta, type DetailTab, type LabTest } from "./data";
import styles from "./lab-results.module.css";
import { TestOverview } from "./test-overview";
import { TestResults } from "./test-results";
import { TestTrends } from "./test-trends";

const PANEL_ID = "lab-detail-panel";

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
  const [tab, setTab] = useState<DetailTab>("Overview");
  const result = statusOfTest(test);
  const Icon = test.icon;

  return (
    <Card rounded className={styles.detail}>
      <header className={styles.detailHead}>
        <ToneTile tone={test.tone} size={56}>
          <Icon />
        </ToneTile>
        <div className={styles.detailTitle}>
          <h2 className="text-h3">{test.name}</h2>
          <p className="text-small text-muted">
            {formatDate(test.date, { month: "short", day: "numeric", year: "numeric" })} • {test.parameters.length}{" "}
            {test.parameters.length === 1 ? "parameter" : "parameters"} • Ordered by {test.orderedBy}
          </p>
        </div>
        <Chip tone={testStatusMeta[result].chip}>{result}</Chip>
      </header>

      <Tabs aria-label="Test sections" panelId={PANEL_ID} value={tab} options={detailTabs} onChange={setTab} />

      <div id={PANEL_ID} role="tabpanel" aria-labelledby={tabId(PANEL_ID, tab)} className={styles.panel}>
        {tab === "Overview" && <TestOverview test={test} onViewAll={() => setTab("Results")} />}
        {tab === "Results" && <TestResults test={test} />}
        {tab === "Trends" && <TestTrends test={test} />}
        {tab === "Comments" && <Comments test={test} />}
      </div>
    </Card>
  );
}
