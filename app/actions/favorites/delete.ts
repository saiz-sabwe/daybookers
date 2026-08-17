"use server";

import {
  djangoFetch,
  DjangoApiError,
  DjangoFavoriteRecord,
  unwrapListPayload,
} from "@/lib/api/django-client";
import { getServerApiToken } from "@/lib/api/server-auth";
import { toUserMessage } from "@/lib/api/user-friendly-error";

async function findFavoriteUuid(
  token: string,
  hotelId: string,
): Promise<string | null> {
  const payload = await djangoFetch<unknown>("/api/hotels/favorites/", token);

  const records = unwrapListPayload<DjangoFavoriteRecord>(payload);
  const match = records.find((f) => f.hotel === hotelId);
  return match?.uuid ?? null;
}

export async function deleteFavorite(
  hotelId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getServerApiToken();
    if (!token) {
      return { success: false, error: "Vous devez être connecté" };
    }

    const favoriteUuid = await findFavoriteUuid(token, hotelId);
    if (!favoriteUuid) {
      return { success: false, error: "Ce favori n'existe pas" };
    }

    await djangoFetch(`/api/hotels/favorites/${favoriteUuid}/`, token, {
      method: "DELETE",
    });

    return { success: true };
  } catch (error) {
    const rawMessage =
      error instanceof DjangoApiError ? error.message : undefined;
    console.error("Erreur lors de la suppression du favori:", error);
    return {
      success: false,
      error: toUserMessage(
        rawMessage,
        "Impossible de retirer cet hôtel de vos favoris.",
      ),
    };
  }
}
