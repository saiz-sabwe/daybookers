"use server";

import db from "@/lib/db";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";

export async function deleteAvailability(
  userId: string,
  availabilityId: string
): Promise<{ success: boolean; error?: string }> {
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

    // Supprimer la disponibilité
    await db.availability.delete({
      where: { id: availabilityId },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de la disponibilité:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la suppression de la disponibilité",
    };
  }
}

