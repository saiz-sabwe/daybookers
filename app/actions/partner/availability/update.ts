"use server";

import db from "@/lib/db";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";

export interface UpdateAvailabilityData {
  available?: boolean;
  price?: number;
  maxGuests?: number;
}

export async function updateAvailability(
  userId: string,
  availabilityId: string,
  data: UpdateAvailabilityData
): Promise<{ success: boolean; error?: string; availability?: any }> {
  try {
    // Récupérer la disponibilité pour vérifier l'accès
    const availability = await db.availability.findUnique({
      where: { id: availabilityId },
      include: {
        roomType: {
          select: { hotelId: true },
        },
      },
    });

    if (!availability) {
      return {
        success: false,
        error: "Disponibilité introuvable",
      };
    }

    // Vérifier que l'utilisateur gère cet hôtel
    const partnerHotels = await getPartnerHotels(userId);
    const hasAccess = partnerHotels.some(
      (hotel) => hotel.id === availability.roomType.hotelId
    );

    if (!hasAccess) {
      return {
        success: false,
        error: "Vous n'avez pas accès à cette disponibilité",
      };
    }

    // Préparer les données de mise à jour
    const updateData: any = {};
    if (data.available !== undefined) updateData.available = data.available;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.maxGuests !== undefined) updateData.maxGuests = data.maxGuests;

    // Mettre à jour la disponibilité
    const updatedAvailability = await db.availability.update({
      where: { id: availabilityId },
      data: updateData,
    });

    return { success: true, availability: updatedAvailability };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la disponibilité:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la mise à jour de la disponibilité",
    };
  }
}

