"use server";

import { djangoFetch, DjangoApiError } from "@/lib/api/django-client";
import { getServerApiToken } from "@/lib/api/server-auth";
import { revalidatePath } from "next/cache";

export async function processPayment(
  bookingId: string,
  _paymentMethod: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getServerApiToken();
    if (!token) {
      return { success: false, error: "Vous devez être connecté" };
    }

    await djangoFetch(`/api/hotels/bookings/${bookingId}/`, token, {
      method: "PATCH",
      body: JSON.stringify({ status: "CONFIRMED" }),
    });

    revalidatePath(`/booking/confirm/${bookingId}`);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    if (error instanceof DjangoApiError) {
      return { success: false, error: error.message };
    }
    console.error("Error processing payment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur lors du traitement du paiement",
    };
  }
}
