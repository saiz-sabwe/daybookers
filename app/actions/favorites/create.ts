"use server";

import { djangoFetch, DjangoApiError } from "@/lib/api/django-client";
import { getServerApiToken } from "@/lib/api/server-auth";
import { toUserMessage } from "@/lib/api/user-friendly-error";

export async function createFavorite(
  hotelId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getServerApiToken();
    if (!token) {
      return { success: false, error: "Vous devez être connecté pour ajouter un favori" };
    }

    await djangoFetch("/api/hotels/favorites/", token, {
      method: "POST",
      body: JSON.stringify({ hotel: hotelId }),
    });

    return { success: true };
  } catch (error) {
    const rawMessage =
      error instanceof DjangoApiError ? error.message : undefined;
    console.error("Erreur lors de l'ajout du favori:", error);
    return {
      success: false,
      error: toUserMessage(
        rawMessage,
        "Impossible d'ajouter cet hôtel à vos favoris.",
      ),
    };
  }
}
