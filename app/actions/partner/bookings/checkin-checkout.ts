"use server";

import {
  partnerMutate,
  parsePartnerError,
  requirePartnerToken,
} from "@/lib/api/partner/fetch";

export async function performCheckIn(bookingId: string, _userId: string) {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return { success: false, error: "Session expirée." };
    }

    await partnerMutate(
      token,
      `/api/hotels/bookings/${bookingId}/`,
      "PATCH",
      { status: "CONFIRMED" },
    );

    return { success: true };
  } catch (error) {
    return { success: false, error: parsePartnerError(error) };
  }
}

export async function performCheckOut(bookingId: string, _userId: string) {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return { success: false, error: "Session expirée." };
    }

    await partnerMutate(
      token,
      `/api/hotels/bookings/${bookingId}/`,
      "PATCH",
      { status: "COMPLETED" },
    );

    return { success: true };
  } catch (error) {
    return { success: false, error: parsePartnerError(error) };
  }
}
