import { LuCalendarCheck } from "react-icons/lu";
import { HyperCalendar } from "@/components/charts/hyper-calendar";
import { Card } from "@/components/ui/card";
import { ToneTile } from "@/components/ui/tone-tile";
import { ChartSummary } from "./chart-summary";
import { appointmentCalendar } from "./data";
import styles from "./dashboard.module.css";

export function AppointmentsCalendar() {
  const { year, month, values, total, previousTotal } = appointmentCalendar;
  const change = `${(((total - previousTotal) / previousTotal) * 100).toFixed(1)}%`;
  const monthName = new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <Card
      title="Appointments"
      description={monthName}
      action={
        <ToneTile tone="primary" size={40}>
          <LuCalendarCheck />
        </ToneTile>
      }
    >
      <div className={styles.summary}>
        <ChartSummary value={total.toLocaleString("en-US")} label={`Compared to ${previousTotal.toLocaleString("en-US")} last month`} change={change} />
      </div>
      <HyperCalendar
        year={year}
        month={month}
        values={values}
        unit="appointments"
        empty="No appointments"
        label={`Appointments per day in ${monthName}, shaded from fewest to most`}
      />
    </Card>
  );
}
