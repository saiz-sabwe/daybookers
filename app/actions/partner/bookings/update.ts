"use server";

import {
  partnerMutate,
  parsePartnerError,
  requirePartnerToken,
} from "@/lib/api/partner/fetch";

async function updateBookingStatus(
  bookingId: string,
  status: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return { success: false, error: "Session expirée." };
    }

    await partnerMutate(
      token,
      `/api/hotels/bookings/${bookingId}/`,
      "PATCH",
      { status },
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating booking:", error);
    return { success: false, error: parsePartnerError(error) };
  }
}

export async function confirmBooking(
  bookingId: string,
  _userId: string,
): Promise<{ success: boolean; error?: string }> {
  return updateBookingStatus(bookingId, "CONFIRMED");
}

export async function cancelBookingByPartner(
  bookingId: string,
  _userId: string,
): Promise<{ success: boolean; error?: string }> {
  return updateBookingStatus(bookingId, "CANCELLED");
}
