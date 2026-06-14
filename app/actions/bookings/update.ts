"use server";

import { djangoFetch, DjangoApiError } from "@/lib/api/django-client";
import { getServerApiToken } from "@/lib/api/server-auth";

export async function cancelBooking(
  bookingId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getServerApiToken();
    if (!token) {
      return { success: false, error: "Vous devez être connecté" };
    }

    await djangoFetch(`/api/hotels/bookings/${bookingId}/`, token, {
      method: "PATCH",
      body: JSON.stringify({ status: "CANCELLED" }),
    });

    return { success: true };
  } catch (error) {
    if (error instanceof DjangoApiError) {
      return { success: false, error: error.message };
    }
    console.error("Erreur lors de l'annulation de la réservation:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de l'annulation de la réservation",
    };
  }
}
