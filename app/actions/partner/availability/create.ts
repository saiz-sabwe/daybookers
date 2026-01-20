"use server";

import db from "@/lib/db";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";

export interface CreateAvailabilityData {
  roomTypeId: string;
  timeSlotId: string;
  date: Date;
  available?: boolean;
  price?: number;
  maxGuests?: number;
}

export async function createAvailability(
  userId: string,
  data: CreateAvailabilityData
): Promise<{ success: boolean; error?: string; availability?: any }> {
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

    // Normaliser la date (sans heures)
    const normalizedDate = new Date(data.date);
    normalizedDate.setHours(0, 0, 0, 0);

    // Vérifier si la disponibilité existe déjà
    const existing = await db.availability.findUnique({
      where: {
        roomTypeId_timeSlotId_date: {
          roomTypeId: data.roomTypeId,
          timeSlotId: data.timeSlotId,
          date: normalizedDate,
        },
      },
    });

    if (existing) {
      return {
        success: false,
        error: "Une disponibilité existe déjà pour cette date et ce créneau",
      };
    }

    // Créer la disponibilité
    const availability = await db.availability.create({
      data: {
        roomTypeId: data.roomTypeId,
        timeSlotId: data.timeSlotId,
        date: normalizedDate,
        available: data.available ?? true,
        price: data.price,
        maxGuests: data.maxGuests,
      },
    });

    return { success: true, availability };
  } catch (error) {
    console.error("Erreur lors de la création de la disponibilité:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la création de la disponibilité",
    };
  }
}

