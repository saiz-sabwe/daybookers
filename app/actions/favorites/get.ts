"use server";

import {
  djangoFetch,
  DjangoFavoriteRecord,
  unwrapListPayload,
} from "@/lib/api/django-client";
import { getServerApiToken } from "@/lib/api/server-auth";
import { getHotels } from "@/app/actions/hotels/get";
import { Hotel } from "@/types";

async function listFavorites(token: string): Promise<DjangoFavoriteRecord[]> {
  const payload = await djangoFetch<unknown>("/api/hotels/favorites/", token);

  return unwrapListPayload<DjangoFavoriteRecord>(payload);
}

export async function getFavorites(): Promise<Hotel[]> {
  try {
    const token = await getServerApiToken();
    if (!token) {
      return [];
    }

    const favorites = await listFavorites(token);
    const favoriteHotelIds = new Set(favorites.map((f) => f.hotel));
    const hotels = await getHotels();

    return hotels.filter((hotel) => favoriteHotelIds.has(hotel.id));
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris:", error);
    return [];
  }
}

export async function isFavorite(hotelId: string): Promise<boolean> {
  try {
    const token = await getServerApiToken();
    if (!token) {
      return false;
    }

    const favorites = await listFavorites(token);
    return favorites.some((f) => f.hotel === hotelId);
  } catch (error) {
    console.error("Erreur lors de la vérification du favori:", error);
    return false;
  }
}
