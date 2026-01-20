"use server";

import db from "@/lib/db";

export async function deleteFavorite(
  hotelId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Vérifier que le favori existe
    const favorite = await db.favorite.findUnique({
      where: {
        userId_hotelId: {
          userId,
          hotelId,
        },
      },
    });

    if (!favorite) {
      return {
        success: false,
        error: "Ce favori n'existe pas",
      };
    }

    // Supprimer le favori
    await db.favorite.delete({
      where: {
        userId_hotelId: {
          userId,
          hotelId,
        },
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Erreur lors de la suppression du favori:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la suppression du favori",
    };
  }
}

