"use server";

import db from "@/lib/db";
import { getHotels } from "@/app/actions/hotels/get";
import { Hotel } from "@/types";

export async function getFavorites(userId: string): Promise<Hotel[]> {
  try {
    const favorites = await db.favorite.findMany({
      where: {
        userId,
      },
      include: {
        hotel: {
          include: {
            city: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Mapper les hôtels vers le format Hotel
    const hotels = await getHotels();
    const favoriteHotelIds = favorites.map((f) => f.hotelId);
    
    return hotels.filter((hotel) => favoriteHotelIds.includes(hotel.id));
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris:", error);
    return [];
  }
}

export async function isFavorite(
  hotelId: string,
  userId: string
): Promise<boolean> {
  try {
    const favorite = await db.favorite.findUnique({
      where: {
        userId_hotelId: {
          userId,
          hotelId,
        },
      },
    });

    return !!favorite;
  } catch (error) {
    console.error("Erreur lors de la vérification du favori:", error);
    return false;
  }
}

