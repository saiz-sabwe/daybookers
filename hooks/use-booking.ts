"use client";

import { useState } from "react";
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

  const updateDate = (date: Date) => {
    setBookingState((prev) => ({ ...prev, date }));
  };

  const updateTimeSlot = (timeSlot: TimeSlot) => {
    setBookingState((prev) => ({ ...prev, timeSlot }));
  };

  const updateGuestCount = (guestCount: { adults: number; children: number }) => {
    setBookingState((prev) => ({ ...prev, guestCount }));
  };

  const resetBooking = () => {
    setBookingState({
      date: null,
      timeSlot: null,
      guestCount: {
        adults: 1,
        children: 0,
      },
    });
  };

  return {
    bookingState,
    updateDate,
    updateTimeSlot,
    updateGuestCount,
    resetBooking,
  };
}

