"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import type { BookingPrefill } from "./book-appointment-modal";
import { useBooking } from "./booking-context";

type Props = Omit<ComponentProps<typeof Button>, "onClick" | "href"> & { prefill?: BookingPrefill };

/** A button that opens the Book Appointment dialog. */
export function BookAppointmentButton({ prefill, ...rest }: Props) {
  const { open } = useBooking();
  return <Button {...(rest as ComponentProps<typeof Button>)} onClick={() => open(prefill)} />;
}
