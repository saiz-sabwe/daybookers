"use server";

import db from "@/lib/db";

export async function createFavorite(
  hotelId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Vérifier que l'hôtel existe
    const hotel = await db.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel) {
      return {
        success: false,
        error: "Hôtel introuvable",
      };
    }

    // Vérifier si le favori existe déjà
    const existingFavorite = await db.favorite.findUnique({
      where: {
        userId_hotelId: {
          userId,
          hotelId,
        },
      },
    });

    if (existingFavorite) {
      return {
        success: false,
        error: "Cet hôtel est déjà dans vos favoris",
      };
    }

    // Créer le favori
    await db.favorite.create({
      data: {
        userId,
        hotelId,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Erreur lors de l'ajout du favori:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de l'ajout du favori",
    };
  }
}

