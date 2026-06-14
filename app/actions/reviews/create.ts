"use server";

import { djangoFetch, DjangoApiError } from "@/lib/api/django-client";
import { getServerApiToken } from "@/lib/api/server-auth";

interface CreateReviewData {
  hotelId: string;
  bookingId: string;
  rating: number;
  title?: string;
  comment: string;
}

export async function createReview(
  data: CreateReviewData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getServerApiToken();
    if (!token) {
      return { success: false, error: "Vous devez être connecté pour publier un avis" };
    }

    if (data.rating < 1 || data.rating > 5) {
      return { success: false, error: "La note doit être comprise entre 1 et 5" };
    }

    await djangoFetch("/api/hotels/reviews/", token, {
      method: "POST",
      body: JSON.stringify({
        hotel: data.hotelId,
        booking: data.bookingId,
        rating: data.rating,
        title: data.title || null,
        comment: data.comment || null,
      }),
    });

    return { success: true };
  } catch (error) {
    if (error instanceof DjangoApiError) {
      return { success: false, error: error.message };
    }
    console.error("Erreur lors de la création de l'avis:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la publication de votre avis",
    };
  }
}
