"use server";

import db from "@/lib/db";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";

export interface BulkAvailabilityData {
  roomTypeId: string;
  timeSlotIds: string[];
  dates: Date[];
  available: boolean;
  price?: number;
  maxGuests?: number;
}

export async function bulkUpdateAvailability(
  userId: string,
  data: BulkAvailabilityData
): Promise<{ success: boolean; error?: string; count?: number }> {
  try {
    // Récupérer le roomType pour vérifier l'accès
    const roomType = await db.roomType.findUnique({
      where: { id: data.roomTypeId },
      select: { hotelId: true },
    });

    if (!roomType) {
      return {
        success: false,
        error: "Type de chambre introuvable",
      };
    }

    // Vérifier que l'utilisateur gère cet hôtel
    const partnerHotels = await getPartnerHotels(userId);
    const hasAccess = partnerHotels.some((hotel) => hotel.id === roomType.hotelId);

    if (!hasAccess) {
      return {
        success: false,
        error: "Vous n'avez pas accès à ce type de chambre",
      };
    }

    let count = 0;

    // Créer ou mettre à jour les disponibilités pour chaque combinaison date/créneau
    for (const date of data.dates) {
      // Normaliser la date (sans heures)
      const normalizedDate = new Date(date);
      normalizedDate.setHours(0, 0, 0, 0);

      for (const timeSlotId of data.timeSlotIds) {
        try {
          await db.availability.upsert({
            where: {
              roomTypeId_timeSlotId_date: {
                roomTypeId: data.roomTypeId,
                timeSlotId,
                date: normalizedDate,
              },
            },
            create: {
              roomTypeId: data.roomTypeId,
              timeSlotId,
              date: normalizedDate,
              available: data.available,
              price: data.price,
              maxGuests: data.maxGuests,
            },
            update: {
              available: data.available,
              price: data.price,
              maxGuests: data.maxGuests,
            },
          });
          count++;
        } catch (error) {
          console.error(`Erreur pour date ${date} et créneau ${timeSlotId}:`, error);
        }
      }
    }

    return { success: true, count };
  } catch (error) {
    console.error("Erreur lors de la mise à jour en masse:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la mise à jour en masse",
    };
  }
}

