import { LuCalendar, LuPlus } from "react-icons/lu";
import { PageHeader } from "@/components/layout/page-header";
import { BookAppointmentButton } from "@/components/booking/book-appointment-button";
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
          <BookAppointmentButton iconLeft={<LuPlus />}>Book appointment</BookAppointmentButton>
        </>
      }
    />
  );
}
