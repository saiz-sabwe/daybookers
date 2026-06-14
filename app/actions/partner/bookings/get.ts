"use server";

import { pendingDjango } from "@/lib/api/pending-django";

export interface PartnerBooking {
  id: string;
  hotelId: string;
  userId: string;
  date: string | Date;
  guestName?: string;
  guestCount: number;
  totalPrice: number;
  finalPrice?: number;
  currency: string;
  status: string;
  hotel: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
    email?: string;
  };
  timeSlot: {
    id: string;
    label?: string;
    startTime: string;
    endTime: string;
  };
}

export async function getPartnerBookings(_userId: string): Promise<PartnerBooking[]> {
  return pendingDjango([], "partner.bookings.get");
}
