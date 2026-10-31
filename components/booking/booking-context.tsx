"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Appointment } from "@/components/appointments/data";
import { BookAppointmentModal, type BookingPrefill, type NewAppointment } from "./book-appointment-modal";

type Booking = {
  /** Opens the Book Appointment dialog, optionally with some choices already made. */
  open: (prefill?: BookingPrefill) => void;
  /** Appointments booked in this session, so the schedule can show them. */
  booked: readonly Appointment[];
};

const BookingContext = createContext<Booking | null>(null);

/** Holds the one Book Appointment dialog for the whole app, so any page can open it. */
export function BookingProvider({ children }: { children: ReactNode }) {
  const [booked, setBooked] = useState<Appointment[]>([]);
  const [prefill, setPrefill] = useState<BookingPrefill | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((next?: BookingPrefill) => {
    setPrefill(next ?? null);
    setIsOpen(true);
  }, []);

  const value = useMemo(() => ({ open, booked }), [open, booked]);

  return (
    <BookingContext.Provider value={value}>
      {children}
      <BookAppointmentModal
        open={isOpen}
        prefill={prefill}
        onClose={() => setIsOpen(false)}
        onBook={(appointment: NewAppointment) => setBooked((current) => [...current, { ...appointment, id: `b${current.length + 1}` }])}
      />
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const booking = useContext(BookingContext);
  if (!booking) throw new Error("useBooking must be used inside BookingProvider");
  return booking;
}
