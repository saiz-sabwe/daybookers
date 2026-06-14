"use server";

import { pendingDjango } from "@/lib/api/pending-django";

export interface CheckInOutBooking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string | null;
  roomType: {
    id: string;
    name: string;
  };
  hotel: {
    id: string;
    name: string;
  };
  date: Date;
  timeSlot: {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
  };
  status: string;
  guestCount: number;
  finalPrice: number;
  currency: string;
  specialRequests: string | null;
}

export async function getTodayCheckIns(
  userId?: string,
  hotelId?: string
): Promise<CheckInOutBooking[]> {
  return pendingDjango([], "partner.bookings.getTodayCheckIns");
}

export async function getTodayCheckOuts(
  userId?: string,
  hotelId?: string
): Promise<CheckInOutBooking[]> {
  return pendingDjango([], "partner.bookings.getTodayCheckOuts");
}
