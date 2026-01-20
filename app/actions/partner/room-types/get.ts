"use server";

import db from "@/lib/db";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";

export async function getRoomTypesByHotel(
  hotelId: string,
  userId: string
): Promise<any[]> {
  try {
    // Vérifier que l'utilisateur gère cet hôtel
    const partnerHotels = await getPartnerHotels(userId);
    const hasAccess = partnerHotels.some((hotel) => hotel.id === hotelId);

    if (!hasAccess) {
      return [];
    }

    // Récupérer les types de chambres
    const roomTypes = await db.roomType.findMany({
      where: { hotelId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return roomTypes;
  } catch (error) {
    console.error("Erreur lors de la récupération des types de chambres:", error);
    return [];
  }
}

