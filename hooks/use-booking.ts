"use client";

import { useCallback, useState } from "react";
import { TimeSlot } from "@/types";

interface BookingState {
  date: Date | null;
  timeSlot: TimeSlot | null;
  guestCount: {
    adults: number;
    children: number;
  };
}

export function useBooking() {
  const [bookingState, setBookingState] = useState<BookingState>({
    date: null,
    timeSlot: null,
    guestCount: {
      adults: 1,
      children: 0,
    },
  });

  const updateDate = useCallback((date: Date) => {
    setBookingState((prev) => ({ ...prev, date }));
  }, []);

  const updateTimeSlot = useCallback((timeSlot: TimeSlot) => {
    setBookingState((prev) => ({ ...prev, timeSlot }));
  }, []);

  const updateGuestCount = useCallback(
    (guestCount: { adults: number; children: number }) => {
      setBookingState((prev) => ({ ...prev, guestCount }));
    },
    [],
  );

  const resetBooking = useCallback(() => {
    setBookingState({
      date: null,
      timeSlot: null,
      guestCount: {
        adults: 1,
        children: 0,
      },
    });
  }, []);

  return {
    bookingState,
    updateDate,
    updateTimeSlot,
    updateGuestCount,
    resetBooking,
  };
}

