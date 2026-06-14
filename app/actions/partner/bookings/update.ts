"use server";

import { pendingMutation } from "@/lib/api/pending-django";

export async function confirmBooking(
  bookingId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  return pendingMutation("partner.bookings.confirm");
}

export async function cancelBookingByPartner(
  bookingId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  return pendingMutation("partner.bookings.cancel");
}
