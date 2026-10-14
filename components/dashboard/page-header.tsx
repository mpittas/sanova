import { LuCalendar, LuDownload, LuPlus } from "react-icons/lu";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { doctor } from "./data";
import { TodayEyebrow } from "./today-eyebrow";

export function DashboardHeader() {
  return (
    <PageHeader
      eyebrow={<TodayEyebrow />}
      title={
        <>
          Welcome back, Dr. {doctor.surname} <span aria-hidden>👋</span>
        </>
      }
      description="Here's your clinic overview for today."
      actions={
        <>
          <Button variant="secondary" iconLeft={<LuCalendar />}>
            Calendar
          </Button>
          <Button variant="secondary" iconLeft={<LuDownload />}>
            Export
          </Button>
          <Button iconLeft={<LuPlus />}>Book appointment</Button>
        </>
      }
    />
  );
}
