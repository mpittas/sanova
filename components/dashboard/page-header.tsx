import { LuCalendar, LuPlus } from "react-icons/lu";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { doctor } from "./data";
import { TodayLine } from "./today-line";

export function DashboardHeader() {
  return (
    <PageHeader
      title={`Welcome back, Dr. ${doctor.surname}`}
      description={<TodayLine />}
      actions={
        <>
          <Button variant="secondary" iconLeft={<LuCalendar />}>
            Calendar
          </Button>
          <Button iconLeft={<LuPlus />}>Book appointment</Button>
        </>
      }
    />
  );
}
