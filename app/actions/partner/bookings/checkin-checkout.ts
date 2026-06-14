"use server";

import { pendingMutation } from "@/lib/api/pending-django";

export async function performCheckIn(bookingId: string, userId: string) {
  return pendingMutation("partner.bookings.checkIn");
}

export async function performCheckOut(bookingId: string, userId: string) {
  return pendingMutation("partner.bookings.checkOut");
}
