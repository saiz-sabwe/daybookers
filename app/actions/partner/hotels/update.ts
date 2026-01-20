"use server";

import db from "@/lib/db";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";

export interface UpdateHotelData {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  stars?: number;
}

export async function updateHotel(
  hotelId: string,
  data: UpdateHotelData,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Vérifier que l'utilisateur gère cet hôtel
    const partnerHotels = await getPartnerHotels(userId);
    const hasAccess = partnerHotels.some((hotel) => hotel.id === hotelId);

    if (!hasAccess) {
      return {
        success: false,
        error: "Vous n'avez pas l'autorisation de modifier cet hôtel",
      };
    }

    // Mettre à jour l'hôtel
    await db.hotel.update({
      where: { id: hotelId },
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        phone: data.phone,
        email: data.email,
        website: data.website,
        stars: data.stars,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'hôtel:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la mise à jour de l'hôtel",
    };
  }
}

